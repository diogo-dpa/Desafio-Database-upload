import multer from 'multer';
import path from 'path';

import crypto from 'crypto'

const tmpFolder = path.resolve(__dirname, '..','..','tmp');

export default {
    directory: tmpFolder,

    storage: multer.diskStorage({
        destination: tmpFolder,
        filename(request, file, callback){

            const fileHash = crypto.randomBytes(10).toString('HEX');
			// gera o nome do arquivo junto comfileHash
			const fileName = `${fileHash}-${file.originalname}`; // evita duplicação dessa forma
		
			// o 1º parametro é um erro, caso aconteça
			// o 2º é o nome do arquivo, cao não aconteça erro
			return callback(null, fileName);
        }

    })


}