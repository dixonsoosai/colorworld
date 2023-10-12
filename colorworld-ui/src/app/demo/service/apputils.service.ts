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
}

export const getISOCurrentDate = () => {
	return new Date().toISOString();
}

export const getISODate = (date: Date) => {
	return date.toISOString();
}