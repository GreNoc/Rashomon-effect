import React, {useCallback, useState} from "react";
import MarkdownBox from "../../utils/MarkdownBox/MarkdownBox.tsx";
import NextButton from "../../utils/NextButton/NextButton.tsx";
import BoxCol from "../../utils/BoxCol/BoxCol.tsx";
import Box from "../../utils/Box/Box.tsx";
import ValidatedInput from "../../utils/ValidatedInput/ValidatedInput.tsx";
import * as Yup from "yup";
import {InferType, ValidationError} from "yup";
import BackgroundContainer from "../../utils/BackgroundContainer/BackgroundContainer.tsx";


const markdown = `
## Please enter your Prolific ID
`

const formSchema = Yup.object().shape({
    prolificId: Yup.string()
        .required("Input required.")
});

type FormSchema = InferType<typeof formSchema>;

interface EnterProlificIdProps {
    onNext: (prolificId: string) => void
}

const EnterProlificId: React.FC<EnterProlificIdProps> = ({onNext}): JSX.Element => {

    const [formData, setFormData] = useState<Partial<FormSchema>>({
        prolificId: undefined
    });


    const validateField = (field: keyof FormSchema, value: string) => {
        try {
            const fieldSchema = Yup.reach(formSchema, field) as Yup.Schema
            fieldSchema.validateSync(value)
            return { isValid: true, error: null };
        } catch (err) {
            if (err instanceof ValidationError) {
                return { isValid: false, error: err.message };
            }
            return { isValid: false, error: 'Validation failed' };
        }
    };

    const isFormValid = useCallback((): boolean => {
        try {
            formSchema.validateSync(formData, { abortEarly: false });
            return true;
        } catch (err) {
            return false;
        }
    }, [formData]);

    const handleFieldChange = (field: keyof FormSchema) => (value: string): void => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <BackgroundContainer>
            <div>
                <BoxCol>
                    <Box color={"transparent"}>
                        <MarkdownBox markdown={markdown}/>
                    </Box>
                    <Box color={"transparent"}>
                        <ValidatedInput
                            validate={(value) => validateField('prolificId', value)}
                            placeholder="Enter your Prolific ID here."
                            onChange={handleFieldChange('prolificId')}
                            indicatedValidInput={false}
                        />
                    </Box>
                </BoxCol>
                <NextButton onNext={() => onNext(formData.prolificId as string)} isValid={isFormValid()}/>
            </div>
        </BackgroundContainer>
    )
}

export default EnterProlificId
