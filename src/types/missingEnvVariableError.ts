class MissingEnvVariableError extends Error {
    constructor(variableName: string) {
        const message = `The environment variable '${variableName}' is missing.`;
        super(message);
        this.name = 'MissingEnvVariableError';
    }
}

export default MissingEnvVariableError;
