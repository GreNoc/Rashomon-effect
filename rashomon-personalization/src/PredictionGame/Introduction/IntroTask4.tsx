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

const markdownHeader = "# Temperature & Time: Working Together!"

const mdInteractionExplanation = `
You are doing great! 

For e.g. *Temperature* and *Hour* we can state:
- **Temperature**: When it is hot, people buy more ice cream. 
- **Hour**: People buy most ice cream in the afternoon hours.

If you don't just look at them in isolation, they can also interact with each other. That is why we also have *interaction effects*:
- If it’s **hot** and it’s **lunchtime**, you’ll sell **even more** ice cream because both factors are working together. 
- But if it’s **cold** and it’s **early morning**, you’ll sell **less** ice cream because both factors are working against you.
`
const mdInteractionTask = `
**Quick Task**:
What is the effect value at 30°C if it’s 20:00?
`

const mdHint = `
**Hint**: 
- Find temperature on the bottom
- Find time on the left
- Look where they meet
- Use the color scale on the right to read the value
`

const formSchema = Yup.object().shape({
    interactionEffect: Yup.number()
        .required("Input required.")
        .typeError("Please enter a valid number.")
        .min(23, "Wrong answer.")
        .max(23, "Wrong answer."),
});

type FormSchema = InferType<typeof formSchema>;

interface IntroTask4Props {
    onNext: (introTask4Answer: object) => void

}

const IntroTask4: React.FC<IntroTask4Props> = ({onNext}) : JSX.Element => {

    const [formData, setFormData] = useState<Partial<FormSchema>>({
        interactionEffect: undefined,
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
            <MarkdownBox markdown={markdownHeader}/>
            <BoxCol>
                <BoxRow>
                    <Box color={"grey"}>
                        <MarkdownBox markdown={mdInteractionExplanation}/>
                    </Box>
                </BoxRow>
                <BoxRow>
                    <BoxCol>
                        <div className="chart-item">
                            <DashboardPlot dashboardData={iceCreamPlotData["Temperature x Hour"]}/>
                        </div>
                    </BoxCol>
                    <BoxCol>
                        <Box color={"blue"}>
                            <MarkdownBox markdown={mdInteractionTask}/>
                            <ValidatedInput
                                validate={(value) => validateField('interactionEffect', value)}
                                placeholder="Enter effect value"
                                onChange={handleFieldChange('interactionEffect')}
                            />
                        </Box>
                        <Box color={"green"}>
                            <MarkdownBox markdown={mdHint}/>
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

export default IntroTask4