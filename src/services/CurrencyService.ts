interface Currency {
  code: string;
  symbol: string;
  name: string;
}

class CurrencyService {
  private static readonly currencies: Currency[] = [
    { code: 'BRL', symbol: 'R$', name: 'Real Brasileiro' },
    { code: 'USD', symbol: '$', name: 'Dólar Americano' },
    { code: 'EUR', symbol: '€', name: 'Euro' }, 
  ];

  public static getAvailableCurrencies(): Currency[] {
    return this.currencies;
  }

  public static getCurrencyByCode(code: string): Currency | undefined {
    return this.currencies.find(currency => currency.code === code);
  }

  public static getCurrencySymbol(code: string): string {
    const currency = this.getCurrencyByCode(code);
    return currency ? currency.symbol : '';
  }

  public static getDefaultCurrency(): Currency {
    // Retorna BRL como moeda padrão ou a primeira moeda disponível
    return this.getCurrencyByCode('BRL') || this.currencies[0];
  }
}

export default CurrencyService;
