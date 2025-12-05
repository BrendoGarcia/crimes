import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome';

// Aumenta o tempo limite para testes de UI
jest.setTimeout(60000);

describe('Testes Funcionais da Tela de Análise (Branch demo)', () => {
  let driver: WebDriver;
  const url = 'https://crimes-nine.vercel.app/';

  beforeAll(async () => {
    const options = new chrome.Options();
    options.addArguments('--headless=new'); 
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--disable-gpu');
    options.addArguments('--window-size=1920,1080');

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
  });

  afterAll(async () => {
    if (driver) await driver.quit();
  });

  beforeEach(async () => {
    // Abre a página raiz
    await driver.get(url);

    // Clica no botão "Análise" para navegar para a subpágina correta
    const botaoAnalise = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(text(), 'Análise')]")),
      15000
    );
    await botaoAnalise.click();

    // Espera o header da subpágina carregar
    const header = await driver.wait(
      until.elementLocated(By.xpath("//h1[contains(text(), 'Análise Detalhada com Filtros')]")),
      30000
    );
    await driver.wait(until.elementIsVisible(header), 30000);
  });

  // Teste 1: Interação básica
  test('Fluxo 1: Deve selecionar um filtro de Faixa Etária e o botão Limpar Filtros deve aparecer', async () => {
    const ageButton = await driver.wait(
      until.elementLocated(By.css('#age-15-29')),
      10000
    );
    await ageButton.click();

    const clearButton = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(text(), 'Limpar Filtros')]")),
      5000
    );
    expect(await clearButton.isDisplayed()).toBe(true);
  });

  // Teste 2: Limpar Filtros
  test('Fluxo 2: Deve limpar os filtros ao clicar no botão Limpar Filtros', async () => {
    const ageButton = await driver.wait(
      until.elementLocated(By.css('#age-15-29')),
      10000
    );
    await ageButton.click();

    const clearButton = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(text(), 'Limpar Filtros')]")),
      5000
    );
    await clearButton.click();

    const ageButtonAfterClear = await driver.wait(
      until.elementLocated(By.css('#age-15-29')),
      5000
    );
    expect(await ageButtonAfterClear.getAttribute('aria-checked')).toBe('false');
  });

  // Teste 3: Múltiplos filtros
  test('Fluxo 3: Deve aplicar múltiplos filtros (Faixa Etária e Etnia)', async () => {
    const ageButton = await driver.wait(
      until.elementLocated(By.css('#age-15-29')),
      10000
    );
    await ageButton.click();

    const ethnicityButton = await driver.wait(
      until.elementLocated(By.css('#ethnicity-Branca')),
      10000
    );
    await ethnicityButton.click();

    expect(await ageButton.getAttribute('aria-checked')).toBe('true');
    expect(await ethnicityButton.getAttribute('aria-checked')).toBe('true');

    const chartTitle = await driver.wait(async () => {
      const el = await driver.findElement(By.xpath("//h3[contains(text(), 'Distribuição por Faixa Etária')]"));
      return (await el.isDisplayed()) ? el : null;
    }, 30000); // aumenta timeout para 30s
    
    expect(await chartTitle.isDisplayed()).toBe(true);
  });
});
