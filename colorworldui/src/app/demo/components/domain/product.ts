
export interface Product {
    id?: string;
    code?: string;
    name?: string;
    description?: string;
    price?: number;
    quantity?: number;
    inventoryStatus?: string;
    category?: string;
    image?: string;
    rating?: number;
}

export class ProductItem {
	pnscnm: string;
	pnhsnc: number;
	pncgst: number;
	pnsgst: number;
	pnuqty: number;
	pnunit: string;
	pnmrp: number;
}

export class InvoiceItem {
    pnpdcd: string;
	pnscnm: string;
	pnhsnc: number;
	pncgst: number;
	pncgstam: number;
	pnsgst: number;
	pnsgstam: number;
	pnuqty: number;
	pnunit: string;
	pnmrp: number;
	pnfmrp: number;
}