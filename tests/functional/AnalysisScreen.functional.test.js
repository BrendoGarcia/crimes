const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

// Aumenta o tempo limite para testes de UI
jest.setTimeout(40000);

describe('Testes Funcionais da Tela de Análise (Branch demo)', () => {
  let driver;
  const url = 'https://brendogarcia.github.io/crimes/'; // URL da branch demo

  beforeAll(async () => {
    // Configuração para rodar o Chrome em modo headless (sem interface gráfica)
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(new chrome.Options().headless())
      .build();
  });

  afterAll(async () => {
    await driver.quit();
  });

  beforeEach(async () => {
    await driver.get(url);
    // Espera a tela principal carregar
    await driver.wait(until.elementLocated(By.xpath("//h1[contains(text(), 'Análise Detalhada com Filtros')]")), 15000);
  });

  // Teste 1: Interação básica - Selecionar um filtro e verificar a mudança
  test('Fluxo 1: Deve selecionar um filtro de Faixa Etária e o botão Limpar Filtros deve aparecer', async () => {
    // 1. Localiza o checkbox de "Faixa Etária" (ex: 18-24)
    // O elemento de checkbox é difícil de selecionar diretamente. Vamos buscar o label que o contém.
    const labelFaixaEtaria = await driver.wait(until.elementLocated(By.xpath("//label[contains(text(), '18-24')]")), 10000);
    
    // 2. Clica no label (o que ativa o checkbox associado)
    await labelFaixaEtaria.click();

    // 3. Verifica se o botão "Limpar Filtros" está visível (indicando que um filtro foi aplicado)
    const clearButton = await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'Limpar Filtros')]")), 5000);
    expect(await clearButton.isDisplayed()).toBe(true);
  });

  // Teste 2: Limpar Filtros
  test('Fluxo 2: Deve limpar os filtros ao clicar no botão Limpar Filtros', async () => {
    // 1. Aplica um filtro (como no Teste 1)
    const labelFaixaEtaria = await driver.wait(until.elementLocated(By.xpath("//label[contains(text(), '18-24')]")), 10000);
    await labelFaixaEtaria.click();

    // 2. Clica no botão "Limpar Filtros"
    const clearButton = await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'Limpar Filtros')]")), 5000);
    await clearButton.click();

    // 3. Verifica se o checkbox foi desmarcado.
    // O elemento input do checkbox deve ter o atributo 'aria-checked="false"' após a limpeza.
    const checkboxInput = await driver.wait(until.elementLocated(By.xpath("//label[contains(text(), '18-24')]/preceding-sibling::input")), 5000);
    expect(await checkboxInput.getAttribute('aria-checked')).toBe('false');
  });

  // Teste 3: Interação com múltiplos filtros (simulando uma busca complexa)
  test('Fluxo 3: Deve aplicar múltiplos filtros (Faixa Etária e Etnia)', async () => {
    // 1. Aplica filtro de Faixa Etária
    const labelFaixaEtaria = await driver.wait(until.elementLocated(By.xpath("//label[contains(text(), '18-24')]")), 10000);
    await labelFaixaEtaria.click();

    // 2. Aplica filtro de Etnia (ex: Branca)
    const labelEtnia = await driver.wait(until.elementLocated(By.xpath("//label[contains(text(), 'Branca')]")), 10000);
    await labelEtnia.click();

    // 3. Verifica se ambos os filtros estão marcados
    const checkboxFaixaEtaria = await driver.wait(until.elementLocated(By.xpath("//label[contains(text(), '18-24')]/preceding-sibling::input")), 5000);
    const checkboxEtnia = await driver.wait(until.elementLocated(By.xpath("//label[contains(text(), 'Branca')]/preceding-sibling::input")), 5000);

    expect(await checkboxFaixaEtaria.getAttribute('aria-checked')).toBe('true');
    expect(await checkboxEtnia.getAttribute('aria-checked')).toBe('true');

    // 4. Verifica se o gráfico ou tabela de resultados foi atualizado (simulando a espera por um elemento de resultado)
    // Seu código usa o componente CrimeChart. Vamos esperar por ele.
    await driver.wait(until.elementLocated(By.xpath("//h2[contains(text(), 'Distribuição por Faixa Etária')]")), 15000);
    const chartTitle = await driver.findElement(By.xpath("//h2[contains(text(), 'Distribuição por Faixa Etária')]"));
    expect(await chartTitle.isDisplayed()).toBe(true);
  });
});
