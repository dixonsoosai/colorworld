import { getISOCurrentDate } from "../service/apputils.service";

export class PurchaseBill {
    arbillno: string = "";
    ardate: string = "";
    arname: string = "";
    argstno: string = "";
    arnamt: number = 0;
    arcgst: number = 0;
    arsgst: number = 0;
    artamt: number = 0;
    archqdte: string = "";
    archqno: number = 0;
    archqamt: number = 0;
    arbname: string = "";
    artext: string = "";
    artype: string = "Purchase";
  }