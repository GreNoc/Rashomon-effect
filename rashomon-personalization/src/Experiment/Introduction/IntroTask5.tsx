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

const markdownHeader = "# Spotting Important Patterns"

const mdHourPattern = `
**Example Pattern**:
Sharp increase during morning hours (9-12 AM)
`

const mdWorkingdayPattern = `
**Example Pattern**:
More sales on workingdays compared to weekends
`

const mdTemperaturePattern = `
**Example Pattern**:
Steady increase across all temperatures
`

const mdInteractionPattern = `
**Example Pattern**:
Strong effects (red) during warm evenings
`

const mdTask = `
**What other patterns do you notice? List at least two:**
`

const mdHint = `
**Hint**: 
- Compare the scales on the y-axes
- Look for peaks and plateaus
- Check where patterns change notably
- In the interaction plot red indicates stronger effects
`

const formSchema = Yup.object().shape({
    patternInput1: Yup.string()
        .required("Input required."),
    patternInput2: Yup.string()
        .required("Input required.")
});

type FormSchema = InferType<typeof formSchema>;

interface IntroTask5Props {
    onNext: (introTask5Answer: object) => void
}

const IntroTask5: React.FC<IntroTask5Props> = ({onNext}) : JSX.Element => {

    const [formData, setFormData] = useState<Partial<FormSchema>>({
        patternInput1: undefined,
        patternInput2: undefined,
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
      const validatedForm = formSchema.validateSync(formData, { abortEarly: false });
      console.log("form is valid", validatedForm)
      return true;
    } catch (err) {
      console.log("form is invalid")
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
                    <BoxCol>
                        <div className="chart-item">
                            <DashboardPlot dashboardData={iceCreamPlotData["Hour"]}/>
                        </div>
                    </BoxCol>
                    <BoxCol>
                        <div className="chart-item">
                            <DashboardPlot dashboardData={iceCreamPlotData["Working Day"]}/>
                        </div>
                    </BoxCol>
                    <BoxCol>
                        <Box color={"red"}>
                            <MarkdownBox markdown={mdTask}/>
                            <ValidatedInput
                                validate={(value) => validateField('patternInput1', value)}
                                placeholder="Enter pattern"
                                onChange={handleFieldChange('patternInput1')}
                            />
                            <ValidatedInput
                                validate={(value) => validateField('patternInput2', value)}
                                placeholder="Enter pattern"
                                onChange={handleFieldChange('patternInput2')}
                            />
                        </Box>
                    </BoxCol>
                </BoxRow>
                <BoxRow>
                    <BoxCol>
                        <Box color={"blue"}>
                            <MarkdownBox markdown={mdHourPattern}/>
                        </Box>
                    </BoxCol>
                    <BoxCol>
                        <Box color={"blue"}>
                            <MarkdownBox markdown={mdWorkingdayPattern}/>
                        </Box>
                    </BoxCol>
                    <BoxCol>
                    </BoxCol>
                </BoxRow>
                <BoxRow>
                    <BoxCol>
                        <div className="chart-item">
                            <DashboardPlot dashboardData={iceCreamPlotData["Temperature"]}/>
                        </div>
                    </BoxCol>
                    <BoxCol>
                        <div className="chart-item">
                            <DashboardPlot dashboardData={iceCreamPlotData["Temperature x Hour"]}/>
                        </div>
                    </BoxCol>
                    <BoxCol>
                        <Box color={"green"}>
                            <MarkdownBox markdown={mdHint}/>
                        </Box>
                    </BoxCol>
                </BoxRow>
                <BoxRow>
                    <BoxCol>
                        <Box color={"blue"}>
                            <MarkdownBox markdown={mdTemperaturePattern}/>
                        </Box>
                    </BoxCol>
                    <BoxCol>
                        <Box color={"blue"}>
                            <MarkdownBox markdown={mdInteractionPattern}/>
                        </Box>
                    </BoxCol>
                    <BoxCol>
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

export default IntroTask5