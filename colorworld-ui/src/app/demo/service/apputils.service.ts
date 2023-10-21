import * as FileSaver from 'file-saver';
import { PurchaseBill } from '../domain/purchase';
import { SSTNHDP } from '../domain/sstnhdp';

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

export const getISODate2 = (date: Date) => {
	return date.toISOString().replace("T", " ").replace("Z", "");
};

export const getDMY = (date: Date): string => {
	let formattedDate = `${date.getDay().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${(date.getFullYear()).toString()}`;
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
	let filteredData = data;
	import('xlsx').then((xlsx) => {
		const worksheet = xlsx.utils.json_to_sheet(filteredData);
		const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
		const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
		let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
		let EXCEL_EXTENSION = '.xlsx';
		const data: Blob = new Blob([excelBuffer], {
			type: EXCEL_TYPE
		});
		FileSaver.saveAs(data, filename + EXCEL_EXTENSION);
	});
};

export const getInvoiceHeader = () : any => {
	let data = [
		[
			"Invoice Number",
			"Company Name",
			"Cheque Date",
			"Company GST",
			"Invoice Date",
			"Invoice Amount",
			"Previous Balance",
			"Grand Total",
			"Cash Received",
			"Returned Amount"
		]
	];
	return data;
};

export const getPurchaseHistoryHeader = () : any => {
	let data =  [
		[
			"Invoice No",
			"Invoice Date",
			"Company Name",
			"Company GST",
			"Net Amount",
			"CGST",
			"SGST",
			"Total Amount",
			"Cheque Date",
			"Cheque Number",
			"Cheque Amount",
			"Bank Name",
			"Text",
			"Bill Type"
		]
	];
	return data;
}

export const formatInvoiceData = (data: SSTNHDP[]) => {
	return data.map(element => {
		return {
			tnbillno: formatBillNum(element.tnbillno),
			tnname: element.tnname,
			tnchqdt: element.tnchqdt,
			tnpgst: element.tnpgst,
			tntime: getDMY(new Date(element.tntime)),
			tntotal: element.tntotal,
			tnprbn: element.tnprbn,
			tngdtl: element.tngdtl,
			tncsrv: element.tncsrv,
			tnrtna: element.tnrtna
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