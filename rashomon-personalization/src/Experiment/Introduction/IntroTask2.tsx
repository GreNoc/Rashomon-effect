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

const markdownHeader = "# Reading Different Types of Effects"

const mdTemperatureTask = `
**Quick Task:**

What's the effect at 30°C?
`

const mdHourTask = `
**Quick Task:**

Which hour shows the highest effect?
`

const mdWorkingDayTask = `
**Quick Task:**

What's the difference between working day and no working day (weekend) effects?
`

const mdDifferenceQuestion = `
**Notice Something Different?**

- Temperature and Hour effects show stepwise changes over ranges
- Workday effects show a simple comparison between two options
`

const formSchema = Yup.object().shape({
    temperatureEffect: Yup.number()
        .required("Input required.")
        .typeError("Please enter a valid number.")
        .min(35, "Wrong answer.")
        .max(35, "Wrong answer."),
    hourEffect: Yup.number()
        .required("Input required.")
        .typeError("Please enter a valid number.")
        .min(19.5, "Wrong answer.")
        .max(21.5, "Wrong answer."),
    workingdayEffect: Yup.number()
        .required("Input required.")
        .typeError("Please enter a valid number.")
        .min(27, "Wrong answer.")
        .max(27, "Wrong answer.")
});

type FormSchema = InferType<typeof formSchema>;

interface IntroTask2Props {
    onNext: (introTask1Answer: object) => void
}

const IntroTask2: React.FC<IntroTask2Props> = ({onNext}) : JSX.Element => {

    const [formData, setFormData] = useState<Partial<FormSchema>>({
        temperatureEffect: undefined,
        hourEffect: undefined,
        workingdayEffect: undefined,
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
                    <BoxCol>
                        <div className="chart-item">
                            <DashboardPlot dashboardData={iceCreamPlotData["Temperature"]}/>
                        </div>
                    </BoxCol>
                    <BoxCol>
                        <div className="chart-item">
                            <DashboardPlot dashboardData={iceCreamPlotData["Hour"]}/>
                        </div>
                    </BoxCol>
                    <BoxCol>
                        <div className="chart-item">
                            <DashboardPlot dashboardData={iceCreamPlotData["Workday"]}/>
                        </div>
                    </BoxCol>
                </BoxRow>
                <BoxRow>
                    <BoxCol>
                        <Box color={"blue"}>
                            <MarkdownBox markdown={mdTemperatureTask}/>
                            <ValidatedInput
                                validate={(value) => validateField('temperatureEffect', value)}
                                placeholder="Enter effect value"
                                onChange={handleFieldChange('temperatureEffect')}
                            />
                        </Box>
                    </BoxCol>
                    <BoxCol>
                        <Box color={"green"}>
                            <MarkdownBox markdown={mdHourTask}/>
                            <ValidatedInput
                                validate={(value) => validateField('hourEffect', value)}
                                placeholder="Enter hour (0-23)"
                                onChange={handleFieldChange('hourEffect')}
                            />
                        </Box>
                    </BoxCol>
                    <BoxCol>
                        <Box color={"yellow"}>
                            <MarkdownBox markdown={mdWorkingDayTask}/>
                            <ValidatedInput
                                validate={(value) => validateField('workingdayEffect', value)}
                                placeholder="Enter difference"
                                onChange={handleFieldChange('workingdayEffect')}
                            />
                        </Box>
                    </BoxCol>
                </BoxRow>
                <BoxRow>
                    <Box color={"grey"}>
                        <MarkdownBox markdown={mdDifferenceQuestion}/>
                    </Box>
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

export default IntroTask2