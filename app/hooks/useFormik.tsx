import useTitleValidation from "./validation/useTitleValidation";

export default function useFormik(title:any) {
    const validationTitle = useTitleValidation();

    const initialValues = { title };
    const validationSchema = validationTitle; 

    return {
        initialValues,
        validationSchema
    };
}