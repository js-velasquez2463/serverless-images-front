// En AddImage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getImage, uploadImage, processExifMetadata, encryptExifMetadata, uploadMetadataFile, generateJumbf, downloadFile, processJumbFile } from '../../utils/api';
import MetadataViewer from '../metadataViewer/MetadataViewer'
import { useLoading } from '../../hooks/useLoading'; 
import { useAuth } from '../../context/AuthContext'
import './index.css';

const AddImage = () => {
    const { userId } = useAuth();
    const { startLoading, stopLoading } = useLoading(); // Usar el hook useLoading
    const [image, setImage] = useState(null);
    const [jumbfImage, setJumbfImage] = useState(null);
    const [file, setFile] = useState(null);
    const [jumbfFile, setJumbfFile] = useState(null);
    const [jumbfStructure, setJumbfStructure] = useState(null);
    const [parsedFileName, setParsedFileName] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(null);

    const [fileName, setFileName] = useState(null);
    const [uploadedImage, setUploadedImage] = useState(false);
    const [metadata, setMetadata] = useState(null);
    const [encryptedMetadata, setEncryptedMetadata] = useState(null);
    const [generatedJumbf, setGeneratedJumbf] = useState(false);
    const [title, setTitle] = useState('');
    const [status, setStatus] = useState('ACTIVE');
    const [age, setAge] = useState('');
    const [role, setRole] = useState('');
    const navigate = useNavigate();

    const fetchImage = async () => {
        try {
            // Llamada a la función, usando los valores de bucketName y objectKey deseados
            const imageData = await getImage('test3.jpeg');
            console.log('termino de cargar la imagen', imageData);
            // Aquí puedes hacer algo con imageData, como mostrar la imagen
        } catch (error) {
            console.log(error);
        }
    };

    const fetchUploadImage = async (fileName, file, userId) => {
        try {
            startLoading();
            const imageData = await uploadImage(fileName, file, userId);
            console.log('termino de subir la imagen', imageData);
            setUploadedImage(true);
        } catch (error) {
            console.log(error);
        } finally {
            stopLoading();
        }
    };

    const fetchProcessMetadata = async (fileName, userId) => {
        try {
            startLoading();
            const imageMetaData = await processExifMetadata(fileName, userId);
            console.log('termino de obtener la metadata', imageMetaData);
            setMetadata(imageMetaData);
        } catch (error) {
            console.log(error);
        } finally {
            stopLoading();
        }
    };

    const fetchEncryptedMetadata = async (fileName) => {
        try {
            startLoading();
            const imageMetaDataEncrypted = await encryptExifMetadata(fileName, userId);
            console.log('termino de obtener la metadata', imageMetaDataEncrypted);
            setEncryptedMetadata(imageMetaDataEncrypted);
        } catch (error) {
            console.log(error);
        } finally {
            stopLoading();
        }
    };

    const fetchGenerateJumbfFile = async (fileName, jsonObject) => {
        startLoading();
        try {
            const data = await uploadMetadataFile(fileName, jsonObject);
            console.log('termino de subir el json', data);
            const data2 = await generateJumbf(fileName);
            console.log('termino de subir el json', data2);
            setGeneratedJumbf(true);
        } catch (error) {
            console.log(error);
        } finally {
            stopLoading();
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const fileName = file.name;
        console.log("Nombre del archivo seleccionado:", fileName);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = (params) => {

            console.log('resulklt', params);
            setImage(reader.result);
            setFile(file);
            setFileName(fileName);
            //fetchUploadImage(fileName, file);
        };
    };

    const fetchDownloadJumbfFile = async (fileName) => {
        startLoading();
        try {
            const file = await downloadFile(fileName);
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = (params) => {

                console.log('resulklt', params);
                setJumbfImage(reader.result);
                setJumbfFile(file);
                //fetchUploadImage(fileName, file);
            };
            setGeneratedJumbf(true);
        } catch (error) {
            console.log(error);
        } finally {
            stopLoading();
        }
    };

    const fetchProcessJumbfFile = async (file, fileName) => {
        startLoading();
        try {
            const targetFile = 'processed_' + fileName;
            const response = await processJumbFile(file, targetFile);
            console.log('responseee ', response);
            setJumbfStructure(response.jumbfBoxList);
            setParsedFileName(response.fileName);
            setErrorMessage(null);
            setLoading(false);
        } catch(error) {
            setJumbfStructure(null);
            setLoading(false);
            setParsedFileName(null);
            console.log(error);
        } finally {
            stopLoading();
        }
    };

    const handleSubmit = () => {
        // Aquí manejarías la lógica para añadir la nueva imagen y la información al estado global o enviarlo a un servidor
        // Volver a la tabla de imágenes
        navigate('/');
    };

    const handleUploadImage = () => {
        // Aquí manejarías la lógica para añadir la nueva imagen y la información al estado global o enviarlo a un servidor
        console.log({ image, title, status, age, role });
        fetchUploadImage(fileName, file, userId);
        // Volver a la tabla de imágenes
        //navigate('/');
    };

    const handleProcessMetadata = () => {
        // Aquí manejarías la lógica para añadir la nueva imagen y la información al estado global o enviarlo a un servidor
        console.log({ image, title, status, age, role });
        fetchProcessMetadata(fileName, userId);
        // Volver a la tabla de imágenes
        //navigate('/');
    };

    const handleEncryptMetadata = () => {
        // Aquí manejarías la lógica para añadir la nueva imagen y la información al estado global o enviarlo a un servidor
        console.log({ image, title, status, age, role });
        fetchEncryptedMetadata(fileName);
        // Volver a la tabla de imágenes
        //navigate('/');
    };

    const handleGenerateJumbf = () => {
        fetchGenerateJumbfFile(fileName, encryptedMetadata);
    };

    const handleDownloadJumbf = () => {
        fetchDownloadJumbfFile(fileName, encryptedMetadata);
    };

    const handleProcessJumbf = () => {
        fetchProcessJumbfFile(jumbfFile, fileName);
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Add New Image</h2>
            <div className="d-flex flex-column align-items-center">
                {image && (
                    <div className="image-preview mb-3">
                        <img src={image} alt="Preview" />
                    </div>
                )}
                <div className="mb-3">
                    <input type="file" className="form-control" onChange={handleImageChange} />
                </div>
                <div className="mb-3">
                    <button className="btn btn-primary" onClick={handleUploadImage} disabled={!file || uploadedImage}>Upload Image</button>
                </div>
                <div className="mb-3">
                    <button className="btn btn-primary" onClick={handleProcessMetadata} disabled={!uploadedImage}>Process Metadata</button>
                </div>
                {/* Renderiza MetadataViewer si metadata no es null */}
                {metadata?.metadata && <MetadataViewer title={'Metadata'} metadata={metadata.metadata} />}
                {/* Resto del formulario */}
                <div className="mb-3">
                    <button className="btn btn-primary" onClick={handleEncryptMetadata} disabled={!metadata}>Encrypt Metadata</button>
                </div>
                {/* Renderiza MetadataViewer si metadata no es null */}
                {encryptedMetadata && <MetadataViewer title={'Metadata Encrypted'} metadata={encryptedMetadata} />}
                {/* Resto del formulario */}
                <div className="mb-3">
                    <button className="btn btn-primary" onClick={handleGenerateJumbf} disabled={!metadata}>Generate JUMBF</button>
                </div>
                <div className="mb-3">
                    <button className="btn btn-primary" onClick={handleDownloadJumbf} disabled={!setGeneratedJumbf}>Download JUMBF</button>
                </div>
                {jumbfImage && (
                    <div className="image-preview mb-3">
                        <img src={jumbfImage} alt="Preview" />
                    </div>
                )}

                <div className="mb-3">
                    <button className="btn btn-primary" onClick={handleProcessJumbf} disabled={!generatedJumbf}>Process JUMBF</button>
                </div>
                {jumbfStructure && <MetadataViewer title={'Jumb Info'} metadata={jumbfStructure} />}
                <button className="btn btn-primary" onClick={handleSubmit}>Go Back</button>
            </div>
        </div>
    );
};

export default AddImage;
