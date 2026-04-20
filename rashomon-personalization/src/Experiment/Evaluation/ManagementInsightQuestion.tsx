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
## Final Phase: Your CityRide Challenge

Examine the personalized AI prediction model and provide 5 insights about bike-sharing patterns.

**Your insights**: 
`

const formSchema = Yup.object().shape({
    insight1: Yup.string().required("Input required."),
    insight2: Yup.string().required("Input required."),
    insight3: Yup.string().required("Input required."),
    insight4: Yup.string().required("Input required."),
    insight5: Yup.string().required("Input required."),
});

type FormSchema = InferType<typeof formSchema>;

const InsightsForm: React.FC<{onNext: (answer: object) => void}> = ({onNext}) => {

    const [formData, setFormData] = useState<Partial<FormSchema>>({
        insight1: undefined,
        insight2: undefined,
        insight3: undefined,
        insight4: undefined,
        insight5: undefined,
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
        onNext(validatedData)
    };

    return (
        <div className="likertScale">
            <div>
                <ValidatedInput
                    validate={(value) => validateField('insight1', value)}
                    placeholder="Enter insight."
                    onChange={handleFieldChange('insight1')}
                    rows={3}
                />
                <ValidatedInput
                    validate={(value) => validateField('insight2', value)}
                    placeholder="Enter insight."
                    onChange={handleFieldChange('insight2')}
                    rows={3}
                />
                <ValidatedInput
                    validate={(value) => validateField('insight3', value)}
                    placeholder="Enter insight."
                    onChange={handleFieldChange('insight3')}
                    rows={3}
                />
                <ValidatedInput
                    validate={(value) => validateField('insight4', value)}
                    placeholder="Enter insight."
                    onChange={handleFieldChange('insight4')}
                    rows={3}
                />
                <ValidatedInput
                    validate={(value) => validateField('insight5', value)}
                    placeholder="Enter insight."
                    onChange={handleFieldChange('insight5')}
                    rows={3}
                />
            </div>
            <NextButton isValid={isFormValid()} onNext={handleSubmit}/>
        </div>
    );
};

const ManagementInsightQuestion : React.FC<ManagementInsightProps> = (
    {
        onNext,
        encoding=JSON.parse(Object.keys(configurationLookup)[0])
    }) => {
    return (
        <div>
            <BackgroundContainer>
                <BoxCol>
                    <BoxRow>
                            <Dashboard {...configurationLookup[JSON.stringify(encoding)]}/>
                    </BoxRow>
                </BoxCol>
                <div>
                    <MarkdownBox markdown={mdIntro}/>
                    <Box color={"transparent"}>
                        <InsightsForm onNext={onNext}/>
                    </Box>
                </div>
            </BackgroundContainer>
        </div>
    )
}
export default ManagementInsightQuestion