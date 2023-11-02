import * as XLSX from 'xlsx';
import { PurchaseBill } from '../domain/purchase';
import { InvoiceSummary } from '../domain/product';

export const successToastr = (detail:string) => {
	return {
		severity: 'success', 
		summary: "Success", 
		detail: detail
	};
};

export const errorToastr = (detail:string) => {
	return {
		severity: 'error', 
		summary: "Error", 
		detail: detail
	};

};
	
export const warnToastr = (detail:string) => {
	return {
		severity: 'warn', 
		summary: "Warning", 
		detail: detail
	};
};

export const infoToastr = (detail:string) => {
	return {
		severity: 'info', 
		summary: "Info", 
		detail: detail
	};
};

export const productUnits = [
	{ name: 'Kg', code: 'kg' },
	{ name: 'gm', code: 'gm' },
	{ name: 'L', code: 'l' },
	{ name: 'ml', code: 'ml' },
	{ name: 'Nos', code: 'Nos'}
];

export const invoiceTab = [
	{ label: 'Products', icon: 'pi pi-fw pi-shopping-cart' },
	{ label: 'Invoice', icon: 'pi pi-fw pi-calendar' },
];

export const getCurrentDate = () => {
	const date = new Date();
	return `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`;
};

export const getISOCurrentDate = () => {
	return new Date().toISOString();
};

export const getISODate = (date: Date) => {
	return date.toISOString();
};

export const getISTDate = (date: Date) => {
	date.setHours(date.getHours() + 5);
	date.setMinutes(date.getMinutes() + 30);
	return date.toISOString();
};

export const getISODate2 = (date: Date) => {
	return date.toISOString().replace("T", " ").replace("Z", "");
};

export const getDMY = (date: Date): string => {
	let formattedDate = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${(date.getFullYear()).toString()}`;
	return formattedDate;
}

export const getLastDay = (date: Date) => {

	let currentMonth = date.getMonth();
	let currentYear = date.getFullYear();

	currentYear = currentMonth + 1 === 12 ? currentYear + 1: currentYear;
	currentMonth = currentMonth + 1 === 12 ? 0: currentMonth + 1;
	return new Date(currentYear, currentMonth, date.getDate() - 1);

};

export const saveAsExcelFile = (data: any, header, filename: string) => {
	let EXCEL_EXTENSION = '.xlsx';
	const workbook = XLSX.utils.book_new();
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
    XLSX.utils.sheet_add_aoa(worksheet, header);
    //Starting in the second row to avoid overriding and skipping headers
    XLSX.utils.sheet_add_json(worksheet, data, { origin: 'A2', skipHeader: true });
    XLSX.utils.book_append_sheet(workbook, worksheet, filename);
    XLSX.writeFile(workbook, filename + EXCEL_EXTENSION);
};

export const getInvoiceHeader = () : any => {
	let data = [
        [
            'Invoice Number',
            'Invoice Date',
            'Company Name',
            'Company GST',
            'GST',
            'Taxable Amount',
            'CGST',
            'SGST',
            'Total Amount',
        ],
    ];
	return data;
};

export const getPurchaseHistoryHeader = () : any => {
	let data = [
        [
            'Invoice No',
            'Invoice Date',
            'Company Name',
            'Company GST',
            'Net Amount',
            'CGST',
            'SGST',
            'Total Amount',
            'Cheque Date',
            'Cheque Number',
            'Cheque Amount',
            'Bank Name',
            'Text',
            'Bill Type',
        ],
    ];
    return data;
}

export const formatInvoiceData = (data: InvoiceSummary[]) => {
	return data.map(element => {
		return {
			tnbillno: formatBillNum(element.tnbillno),
			tntime: getDMY(new Date(element.tntime)),
			tnname: element.tnname,
			tnpgst: element.tnpgst,
			gngstp: element.gngstp,
			gntxable: element.gntxable,
			gncamt: element.gncamt,
			gnsamt: element.gnsamt,
			gntamt: element.gntamt
		};
	});
}

export const formatBillNum = (billnum: number): string => {

	if(billnum > 2000000){
		let year = parseInt(billnum.toString().substring(0,4));
		let num = billnum.toString().substring(4);
		return `${num}/${year.toString()}-${(year + 1).toString().substring(2, 4)}`;
	}
	return billnum.toString();
};

export const formatPurchaseBillData = (data: PurchaseBill[]) => {
	return data.map(element => {
		return {
			arbillno: element.arbillno,
			ardate: getDMY(new Date(element.ardate)),
			arname: element.arname,
			argstno: element.argstno,
			arnamt: element.arnamt,
			arcgst: element.arcgst,
			arsgst: element.arsgst,
			artamt: element.artamt,
			archqdte: element.archqdte,
			archqno: element.archqno,
			archqamt: element.archqamt,
			arbname: element.arbname,
			artext: element.artext,
			artype: element.artype
		}
	});
}