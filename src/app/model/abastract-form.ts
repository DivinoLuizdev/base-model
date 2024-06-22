import { NgForm } from "@angular/forms";
import { MensagemAlerta } from "./message.util";
import { MessageService } from "primeng/api";

export abstract class AbstractForm {

    notification: MensagemAlerta;
    constructor(msg: MessageService) {
        this.notification = new MensagemAlerta(msg);
    }

    showError(input: any, form: NgForm) {
        return input && input.invalid && (input.touched || form.submitted);
    }

    convertNumberToData(valor: number): Date {
        return new Date(valor);
      }

    convertToDate(data: any): Date {
        if (data.toString().includes('-')) {
            return new Date(data.toString());
        }

        let dataString = data.toString();
        let partesData = dataString.split('/');
        let novaData = new Date(partesData[2], partesData[1] - 1, partesData[0]);
        return novaData;
    }

    static convertToDate(data: any): Date {
        if (data.toString().includes('-')) {
            return new Date(data.toString());
        }

        let dataString = data.toString();
        let partesData = dataString.split('/');
        let novaData = new Date(partesData[2], partesData[1] - 1, partesData[0]);
        return novaData;
    }

    convertDateToString(data: any): string {
        if (typeof data === 'string') {
            if (data.includes('/')) {
                return data;
            } else if (data.includes('-')) {
                const partesData = data.split('-');
                return `${partesData[2].substring(0, 2)}/${partesData[1]}/${partesData[0]}`;
            }
        } else if (data instanceof Date) {
            const dia = data.getDate().toString().padStart(2, '0');
            const mes = (data.getMonth() + 1).toString().padStart(2, '0');
            const ano = data.getFullYear().toString();
            return `${dia}/${mes}/${ano}`;
        }
        return data;
    }

    deepcopy<T>(o: T): T {
        return JSON.parse(JSON.stringify(o));
    }

    isValidDate(data: Date) {

        // Verifica o formato da data usando uma expressão regular
        const datePattern = /^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[012])\/(\d{4})$/;
        const match = this.convertDateToString(data).match(datePattern);
        if (!match) {
            return false;
        }

        // Extrai dia, mês e ano da string de data
        const day = parseInt(match[1], 10);
        const month = parseInt(match[2], 10);
        const year = parseInt(match[3], 10);

        // Verifica o mês de fevereiro em anos bissextos
        if (month === 2) {
            const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
            if (day > 29 || (day === 29 && !isLeap)) {
                return false;
            }
        }

        // Verifica os meses que têm 30 dias
        if ((month === 4 || month === 6 || month === 9 || month === 11) && day > 30) {
            return false;
        }

        return true;
    }

    getMesExtenso(mes: number) {
        const meses: string[] = [
            "Janeiro",
            "Fevereiro",
            "Março",
            "Abril",
            "Maio",
            "Junho",
            "Julho",
            "Agosto",
            "Setembro",
            "Outubro",
            "Novembro",
            "Dezembro",
        ];
        return meses[mes - 1]
    }

    getDefaultNumber(param: number) {
        return param ? param : 0;
    }
}