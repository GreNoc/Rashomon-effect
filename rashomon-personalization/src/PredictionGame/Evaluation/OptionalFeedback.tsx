import NextButton from "../../utils/NextButton/NextButton.tsx";
import MarkdownBox from "../../utils/MarkdownBox/MarkdownBox.tsx";
import React, {useCallback, useState} from "react";
import * as Yup from "yup";
import {InferType, ValidationError} from "yup";
import ValidatedInput from "../../utils/ValidatedInput/ValidatedInput.tsx";
import Dashboard from "../../Dashboard/dashboard.tsx";
import {Encoding} from "../Personalization/bandit.ts";
import {normalizedData} from "../Personalization/data.tsx";
import BackgroundContainer from "../../utils/BackgroundContainer/BackgroundContainer.tsx";
import BoxCol from "../../utils/BoxCol/BoxCol.tsx";
import BoxRow from "../../utils/BoxRow/BoxRow.tsx";
import Box from "../../utils/Box/Box.tsx";

interface ManagementInsightProps {
    encoding?: Encoding
    onNext: (answer: object) => void
}

const configurationLookup = normalizedData.configurationData

const mdIntro = `
## Additional Feedback (Optional)
Do you have any comments about the dashboard's helpfulness?
`

const formSchema = Yup.object().shape({
    feedback: Yup.string().notRequired()
});

type FormSchema = InferType<typeof formSchema>;

const InsightsForm: React.FC<Pick<ManagementInsightProps, "onNext">> = ({onNext}) => {

    const [formData, setFormData] = useState<Partial<FormSchema>>({
        feedback: undefined,
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

    const handleSubmit = async (): Promise<void> => {
        const validatedData = await formSchema.validate(formData, { abortEarly: false });
        console.log('Form submitted with:', validatedData);
        onNext(validatedData)
    };

    return (
        <div className="likertScale">
            <div>
                <ValidatedInput
                    validate={(value) => validateField('feedback', value)}
                    placeholder="Enter feedback."
                    onChange={handleFieldChange('feedback')}
                />
            </div>
            <NextButton isValid={isFormValid()} onNext={handleSubmit}/>
        </div>
    );
};

const OptionalFeedbackQuestion : React.FC<ManagementInsightProps> = (
    {
        onNext,
        encoding=JSON.parse(Object.keys(configurationLookup)[0])
    }) => {
    return (
        <div>
            <BackgroundContainer>
                <div>
                    <BoxCol>
                        <BoxRow>
                            <Dashboard {...configurationLookup[JSON.stringify(encoding)]}/>
                        </BoxRow>
                        <BoxRow>
                            <BoxCol>
                                <Box color={"transparent"}>
                                    <MarkdownBox markdown={mdIntro}/>
                                </Box>
                            </BoxCol>
                            <BoxCol>
                                <Box color={"transparent"}>
                                    <InsightsForm onNext={onNext}/>
                                </Box>
                            </BoxCol>
                        </BoxRow>
                    </BoxCol>
                </div>
            </BackgroundContainer>
        </div>
    )
}
export default OptionalFeedbackQuestion