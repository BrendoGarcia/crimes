import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome';

// Aumenta o tempo limite para testes de UI
jest.setTimeout(60000);

describe('Testes Funcionais da Tela de Análise (Branch demo)', () => {
  let driver: WebDriver;
  const url = 'https://crimes-nine.vercel.app/';

  beforeAll(async () => {
    // Configuração para rodar o Chrome headless no CI/Linux
    const options = new chrome.Options();
    options.addArguments('--headless=new'); // headless moderno
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
    if (driver) {
      await driver.quit();
    }
  });

  beforeEach(async () => {
    await driver.get(url);
    // Espera a tela principal carregar
    await driver.wait(
      until.elementLocated(By.xpath("//h1[contains(text(), 'Análise Detalhada com Filtros')]")),
      15000
    );
  });

  // Teste 1: Interação básica
  test('Fluxo 1: Deve selecionar um filtro de Faixa Etária e o botão Limpar Filtros deve aparecer', async () => {
    const labelFaixaEtaria = await driver.wait(
      until.elementLocated(By.xpath("//label[contains(text(), '18-24')]")),
      10000
    );
    await labelFaixaEtaria.click();

    const clearButton = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(text(), 'Limpar Filtros')]")),
      5000
    );
    expect(await clearButton.isDisplayed()).toBe(true);
  });

  // Teste 2: Limpar Filtros
  test('Fluxo 2: Deve limpar os filtros ao clicar no botão Limpar Filtros', async () => {
    const labelFaixaEtaria = await driver.wait(
      until.elementLocated(By.xpath("//label[contains(text(), '18-24')]")),
      10000
    );
    await labelFaixaEtaria.click();

    const clearButton = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(text(), 'Limpar Filtros')]")),
      5000
    );
    await clearButton.click();

    const checkboxInput = await driver.wait(
      until.elementLocated(By.xpath("//label[contains(text(), '18-24')]/preceding-sibling::input")),
      5000
    );
    expect(await checkboxInput.getAttribute('aria-checked')).toBe('false');
  });

  // Teste 3: Múltiplos filtros
  test('Fluxo 3: Deve aplicar múltiplos filtros (Faixa Etária e Etnia)', async () => {
    const labelFaixaEtaria = await driver.wait(
      until.elementLocated(By.xpath("//label[contains(text(), '18-24')]")),
      10000
    );
    await labelFaixaEtaria.click();

    const labelEtnia = await driver.wait(
      until.elementLocated(By.xpath("//label[contains(text(), 'Branca')]")),
      10000
    );
    await labelEtnia.click();

    const checkboxFaixaEtaria = await driver.wait(
      until.elementLocated(By.xpath("//label[contains(text(), '18-24')]/preceding-sibling::input")),
      5000
    );
    const checkboxEtnia = await driver.wait(
      until.elementLocated(By.xpath("//label[contains(text(), 'Branca')]/preceding-sibling::input")),
      5000
    );

    expect(await checkboxFaixaEtaria.getAttribute('aria-checked')).toBe('true');
    expect(await checkboxEtnia.getAttribute('aria-checked')).toBe('true');

    const chartTitle = await driver.wait(
      until.elementLocated(By.xpath("//h2[contains(text(), 'Distribuição por Faixa Etária')]")),
      15000
    );
    expect(await chartTitle.isDisplayed()).toBe(true);
  });
});
