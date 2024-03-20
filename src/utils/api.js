import axios from 'axios';

const IMAGES_BUCKET = 'images-tfm2';

export function getBaseURL(path = '') {
    return `https://dmag5.pc.ac.upc.edu/api/${path}`;
}

export function getBaseURLMetadata(path = '') {
    return `https://q8onxhk818.execute-api.us-east-1.amazonaws.com/Prod/${path}`;
}

export function getBaseUrlJumbf(path = '') {
    return `http://ec2-3-80-81-251.compute-1.amazonaws.com:8080/${path}`;
}

export const apiMetadata = axios.create({
    baseURL: getBaseURLMetadata(),
})

export const apiJumbf = axios.create({
    baseURL: getBaseUrlJumbf(),
})

export const getImage = async (objectKey) => {
    try {
        const response = await apiMetadata.post('getImage', {
            bucketName: IMAGES_BUCKET,
            objectKey: objectKey,
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const imageUrl = response.data.downloadUrl;
        const response2 = await axios.get(imageUrl);
        return response2.data;
    } catch (error) {
        console.error('Error fetching image:', error);
        throw error;
    }
};

export const getImageUrl = async (objectKey, token) => {
    try {
        const response = await axios.post('https://31ho56yrgi.execute-api.us-east-1.amazonaws.com/prod/getImage', 
            {
            "bucketName": IMAGES_BUCKET,
            "objectKey": objectKey
          }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
        });
        return response.data.downloadUrl;

    } catch (error) {
        console.error('Error fetching image:', error);
        //throw error;
    }
};

const uploadJumbfServerFile = async (file) => {
    // Crea un objeto FormData
    const formData = new FormData();

    // Añade el archivo al objeto FormData. Asegúrate de que 'file' es la referencia al archivo a subir
    // El primer parámetro 'file' es el nombre del campo en el formulario multipart/form-data
    formData.append('file', file);

    try {
        const response = await axios({
            method: 'post',
            url: 'http://ec2-3-80-81-251.compute-1.amazonaws.com:8080/api/demo/uploadMetadataFile',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data'
            },
        });

        console.log('Respuesta del servidor:', response.data);
        // Maneja la respuesta aquí...
    } catch (error) {
        console.error('Error al subir el archivo:', error);
        // Maneja el error aquí...
    }
};


// Función para crear un registro de imagen en tu API
export const createImageRecord = async (objectKey) => {
    try {
        // La URL del endpoint API para crear un registro de imagen
        const apiUrl = 'https://q8onxhk818.execute-api.us-east-1.amazonaws.com/Prod/images/create';

        // Parámetros para la solicitud, incluido el nombre del archivo (key)
        const params = new URLSearchParams({ key: objectKey });

        // Datos a enviar en el cuerpo de la solicitud
        const data = {
            bucketName: IMAGES_BUCKET,
            objectKey: objectKey, // Este podría ser el mismo objectKey que pasas como parámetro
        };

        // Realizar la solicitud POST con Axios
        const response = await axios.post(`${apiUrl}?${params.toString()}`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('Image record created successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error creating image record:', error);
        throw error;
    }
};

export const uploadImage = async (objectKey, file) => {
    try {
        const apiUrl = 'https://q8onxhk818.execute-api.us-east-1.amazonaws.com/Prod/uploadImage';
        const params = new URLSearchParams({ key: objectKey });
        const data = {
            bucketName: IMAGES_BUCKET,
            objectKey,
        };

        const response = await axios.post(`${apiUrl}?${params.toString()}`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('Image uploaded successfully:', response.data);
        // Maneja la respuesta aquí...
        const imageUrl = response.data.uploadUrl;
        const response2 = await axios.put(imageUrl, file, {
            headers: {
                'Content-Type': 'image/jpeg',
            },
        });
        const uploadImageData = [
            createImageRecord(objectKey),
            uploadJumbfServerFile(file)
        ]
        const response3 = await Promise.all(uploadImageData);
        console.log('respouestaa 3', response3)
        return response2.data;
    } catch (error) {
        console.error('Error fetching image:', error);
        throw error;
    }
};

export const processExifMetadata = async (objectKey) => {
    try {
        // Actualiza la URL del endpoint API para procesar datos EXIF
        const apiUrl = 'https://q8onxhk818.execute-api.us-east-1.amazonaws.com/Prod/processExif';

        // Datos a enviar en el cuerpo de la solicitud
        const data = {
            bucketName: 'images-tfm2', // Asegúrate de que este sea el bucket correcto
            objectKey: objectKey, // El objectKey de la imagen cuyos datos EXIF quieres procesar
        };

        // Realizar la solicitud POST con Axios
        const response = await axios.post(apiUrl, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('EXIF data processed successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error processing EXIF data:', error);
        throw error;
    }
};

export const encryptExifMetadata = async (objectKey) => {
    try {
        const apiUrl = 'https://q8onxhk818.execute-api.us-east-1.amazonaws.com/Prod/encryptMetadata';
        const data = {
            bucketName: 'images-tfm2', // Asegúrate de que este sea el bucket correcto
            objectKey: objectKey, // El objectKey de la imagen cuyos datos EXIF quieres procesar
        };
        const response = await axios.post(apiUrl, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('Metadata encrypted successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error encrypting metadata:', error);
        throw error;
    }
};

export const uploadMetadataFile = async (objectKey, jsonObject) => {
    try {
        const jsonFileName = objectKey.split('.')[0] + '.json';
        console.log('json file name', jsonFileName);
        const archivoJSON = new Blob([JSON.stringify(jsonObject)], { type: 'application/json' });
        const formData = new FormData();
        formData.append('file', archivoJSON, jsonFileName);
        const response = await axios({
            method: 'post',
            url: 'http://ec2-3-80-81-251.compute-1.amazonaws.com:8080/api/demo/uploadMetadataFile',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data'
            },
        });
        console.log('Respuesta del servidor:', response.data);
    } catch (error) {
        console.log(error);
    }
};

export const generateJumbf = async (objectKey) => {
    try {
        const targetFile = 'target_' + objectKey;
        const jsonFileName = objectKey.split('.')[0] + '.json';
        const apiUrl = 'http://ec2-3-80-81-251.compute-1.amazonaws.com:8080/api/demo/generateBox2';
        const params = new URLSearchParams({
            targetFile: targetFile,
            inputFile: objectKey,
        }).toString();

        const data = {
            fileName: jsonFileName, // Asume que 'content' contiene 'fileName'
            type: 'jumb',
            content: {
                fileName: jsonFileName,
                xlBox: null,
                type: 'json',
                typeId: 2020437024,
                lbox: 643,
                tbox: 2020437024,
                boxSize: 643,
                xboxEnabled: false,
                boxSizeFromBmffHeaders: 643,
                payloadSizeFromBmffHeaders: 635
            },
            description: {
                xlBox: null,
                uuid: '6A736F6E-0011-0010-8000-00AA00389B71',
                contentTypeUuid: '6A736F6E-0011-0010-8000-00AA00389B71',
                toggle: 0,
                label: null,
                id: null,
                privateField: null,
                type: 'jumd',
                typeId: 1786080612,
                requestable: false,
                lbox: 25,
                tbox: 1786080612,
                boxSize: 25,
                xboxEnabled: false,
                boxSizeFromBmffHeaders: 25,
                payloadSizeFromBmffHeaders: 17
            }
        };

        const response = await axios.post(`${apiUrl}?${params}`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('JUMBF generated successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error generating JUMBF:', error);
        throw error;
    }
};

export const downloadFile = async (objectKey) => {
    try {
        const targetFile = 'target_' + objectKey;
        const apiUrl = 'http://ec2-3-80-81-251.compute-1.amazonaws.com:8080/api/demo/download';
        const params = new URLSearchParams({ targetFile: targetFile }).toString();
        
        // Realiza la solicitud y recibe la respuesta como un Blob
        const response = await axios.get(`${apiUrl}?${params}`, {
            responseType: 'blob',
        });

        // Crea un URL temporal para el blob descargado
        return new Blob([response.data]);
    } catch (error) {
        console.error("Error downloading file:", error);
        throw error;
    }
};

export const processJumbFile = async (jumbfFile, jumbfFileName) => {
    try {
        const apiUrl = 'http://ec2-3-80-81-251.compute-1.amazonaws.com:8080/api/demo/uploadJumbfFile';
        const formData = new FormData();
        formData.append('file', jumbfFile, jumbfFileName);
        
        // Realiza la solicitud y recibe la respuesta como un Blob
        const response = await axios({
            method: 'post',
            url: apiUrl,
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data'
            },
        });
        console.log('responseee aca', response)

        // Crea un URL temporal para el blob descargado
        return response?.data;
    } catch (error) {
        console.error("Error downloading file:", error);
        throw error;
    }
};

export const getImages = async (userId) => {
    try {
        const apiUrl = 'https://q8onxhk818.execute-api.us-east-1.amazonaws.com/Prod/getImages';
        const params = new URLSearchParams({ userId }); // Agrega el userId como parámetro de consulta

        // Realiza la solicitud GET
        const response = await axios.get(`${apiUrl}?${params.toString()}`, {
            headers: {
                'Content-Type': 'application/json'
            },
        });

        console.log('response:', response.data);

        // Devuelve los datos de la respuesta
        return response.data;
    } catch (error) {
        console.error("Error fetching images:", error);
        throw error;
    }
};