import React, {useCallback, useState} from "react";
import {DashboardPlot} from "../../Dashboard/dashboard.tsx";
import {iceCreamPlotData} from "./iceCreamData.tsx";
import * as Yup from 'yup';
import MarkdownBox from "../../utils/MarkdownBox/MarkdownBox.tsx";
import Box from "../../utils/Box/Box.tsx";
import BoxCol from "../../utils/BoxCol/BoxCol.tsx";
import BoxRow from "../../utils/BoxRow/BoxRow.tsx";
import {InferType, ValidationError} from "yup";
import ValidatedInput from "../../utils/ValidatedInput/ValidatedInput.tsx";
import NextButton from "../../utils/NextButton/NextButton.tsx";
import BackgroundContainer from "../../utils/BackgroundContainer/BackgroundContainer.tsx";

const markdownHeader = "# Let’s Make Your First Prediction!"

const markdown1 = `
## Your First Task as a Resource Manager at CityRide

Our AI prediction model looks at how different factors increase or decrease ice cream sales from what we would typically expect. Let’s start with temperature: 
- Hot days boost sales
- Cold days reduce them
`

const markdown2 = `
*Hey Resource Manager, tomorrow’s forecast shows 25°C. Based on the temperature effect shown on the left, approximately 
how many extra ice creams should we expect to sell compared to an average day?*
`

const formSchema = Yup.object().shape({
    temperature: Yup.number()
        .required("Input required.")
        .typeError("Please enter a valid number.")
        .min(26, "Wrong answer.")
        .max(26, "Wrong answer.")
});

type FormSchema = InferType<typeof formSchema>;

interface IntroTask1Props {
    onNext: (introTask1Answer: object) => void
}

const IntroTask1: React.FC<IntroTask1Props> = ({onNext}) : JSX.Element => {

    const [formData, setFormData] = useState<Partial<FormSchema>>({
        temperature: undefined
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
            [field]: value === '' ? undefined : Number(value)
        }));
    };

    const handleSubmit = async (): Promise<void> => {
        const validatedData = await formSchema.validate(formData, { abortEarly: false });
        console.log('Form submitted with:', validatedData);
        onNext(validatedData)
    };

    return (
        <BackgroundContainer>
            <BoxCol>
            <BoxRow>
                <MarkdownBox markdown={markdownHeader}/>
            </BoxRow>
            <BoxRow>
                <Box color={"blue"}>
                    <MarkdownBox markdown={markdown1}/>
                </Box>
            </BoxRow>
            <BoxRow>
                <BoxCol>
                    <div className="chart-item">
                        <DashboardPlot dashboardData={iceCreamPlotData["Temperature"]}/>
                    </div>
                </BoxCol>
                    <BoxCol>
                        <Box color={"yellow"}>
                            <MarkdownBox markdown={markdown2}/>
                        </Box>
                        <Box color={"yellow"}>
                            <MarkdownBox markdown={"**Your Answer (Please enter a number)**"}/>
                            <ValidatedInput
                                validate={(value) => validateField('temperature', value)}
                                placeholder="Enter effect value"
                                onChange={handleFieldChange('temperature')}
                            />
                        </Box>
                    </BoxCol>
            </BoxRow>
            </BoxCol>
            <div>
                <NextButton
                    isValid={isFormValid()}
                    onNext={handleSubmit}
                    isLoading={false} // Add loading state management if needed
                />
            </div>
        </BackgroundContainer>
    )
}

export default IntroTask1