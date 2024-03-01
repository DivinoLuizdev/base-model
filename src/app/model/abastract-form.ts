import { NgForm } from "@angular/forms";

export abstract class AbstractForm {
    showError(input: any, form: NgForm) {
        return input && input.invalid && (input.touched || form.submitted);
    }

    convertToDate(data: any) {
        let dataString = data.toString();
        let partesData = dataString.split('/');
        let novaData = new Date(partesData[2], partesData[1] - 1, partesData[0]);
        return novaData;
    }

    convertDateToString(data: any): string {
        debugger
        if (typeof data === 'string') {
            if (data.includes('/')) {
                return data;
            } else if (data.includes('-')) {
                const partesData = data.split('-');
                return `${partesData[2].substring(0,2)}/${partesData[1]}/${partesData[0]}`;
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

}