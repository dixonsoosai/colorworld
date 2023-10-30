
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
    tnbillno: number = 0;
    tnchallan:string = '';
	tnscnnm: string = '';
	tnpdcd: string = '';
	tnhsnc: number = 0;
	tncgst: number = 0;
	tnsgst: number = 0;
	tnuqty: number = 0;
	tnunit: string = '';
	tntqty: number = 0;
	tnprice: number = 0;
	tndisc: number = 0;
	tntxable: number = 0;
	tncamt: number = 0;
	tnsamt: number = 0;
	tntamt: number = 0;
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
	gntxable: number = 0;
	gntcgst : number = 0;
	gntsgst : number = 0;
	gntamt : number = 0;
}

export class InvoiceSummary {
	tnbillno: number = 0;
    tnname: string = "";
    tnpgst: string = "";
    tntime: string = "";
	gngstp : string = "";
	gntxable: number = 0;
	gncamt : number = 0;
	gnsamt : number = 0;
	gntamt : number = 0;	
}