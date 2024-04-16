export class FormulaHeader {
    brand: string;
    model: string;
    shade: string;
    variant: string;
    code: string;
}

export class FormulaBody {
    code: string;
    ingredients: string;
    weight: number;
    price: number;
}

export class Formula extends FormulaHeader{
    formula: FormulaBody[];
}