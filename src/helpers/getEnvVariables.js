
export const getEnvVariables = () => {

    import.meta.env;

    return {
        // Listar una a una las variables en caso de que no ande la linea de abajo
        ...import.meta.env
    };
};