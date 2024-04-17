export class ConvertToBase {


    public imageToBase64Promise(event: any): Promise<string> {

        const promise = new Promise<string>((resolve, reject) => {
            const file: File = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e: any) => {
                    const image = new Image();
                    image.src = e.target.result;
                    image.onload = () => {
                        resolve(image.src);
                    }
                    image.onerror = () => {
                        reject("Unable to convert image into base64")
                    }
                }
                reader.readAsDataURL(file);
            }
        });
        return promise;
    }

    public imageFileToBase64Promise(sFile: File): Promise<string> {

        const promise = new Promise<string>((resolve, reject) => {
            const file: File = sFile;
            if (file) {
                const reader = new FileReader();
                reader.onload = (e: any) => {
                    const image = new Image();
                    image.src = e.target.result;
                    image.onload = () => {
                        resolve(image.src);
                    }
                    image.onerror = () => {
                        reject("Unable to convert image into base64")
                    }
                }
                reader.readAsDataURL(file);
            }
        });
        return promise;
    }

    public pdfToBase64Promise(event: any): Promise<string> {

        const promise = new Promise<string>((resolve, reject) => {
            const file: File = event.target.files[0];

            if (file) {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                    resolve(reader.result as string);
                };
                reader.onerror = () => {
                    reject('failed to convert pdf to base 64');
                }
            }
        });
        return promise;
    }
}