
export class ProductItem {
	pncmpy: string = '';
	pncmpd: string = '';
	pncolor: string = '';
	pnscnm: string = '';
	pnpdcd: string = '';
	pnhsnc: number = 0;
	pncgst: number = 0;
	pnsgst: number = 0;
	pnuqty: number = 0;
	pnunit: string = '';
	pnmrp: number = 0;
	pncuspr: number = 0;
	pnmcpr: number = 0;
	pnspcpr: number = 0;
	pngstpr: number = 0;
	pniostk: number = 0;
	pnavail: string = '';
}

export class InvoiceItem {
    pnchallan:string = '';
	pnscnm: string = '';
	pnpdcd: string = '';
	pnhsnc: number = 0;
	pncgst: number = 0;
	pnsgst: number = 0;
	pnuqty: number = 0;
	pnunit: string = '';
	pntqty: number = 0;
	pnprice: number = 0;
	pnnamt: number = 0;
	pncgsta: number = 0;
	pnsgsta: number = 0;
	pntamt: number = 0;
}

export class BillSummary {
	bsnamt:number = 0;
    bstcgst:number = 0;
    bstsgst:number = 0;
    bstamt: number = 0;
	bsroff: number = 0;
	bsfamt: number = 0;
}

export class GSTSummary {
	gngstp : string = "";
	gnnamt: number = 0;
	gntcgst : number = 0;
	gntsgst : number = 0;
	gntamt : number = 0;
}