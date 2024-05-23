import useLoginValidation from "./validation/useLoginValidation";
import useTitleValidation from "./validation/useTitleValidation";

export default function useFormikLogin() {
    const validationLogin = useLoginValidation();

    const initialValues = {};
    const validationSchema = validationLogin; 

    return {
        initialValues,
        validationSchema
    };
}