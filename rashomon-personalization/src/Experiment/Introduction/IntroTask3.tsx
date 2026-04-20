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
import { Equal, Plus } from 'lucide-react';
import BackgroundContainer from "../../utils/BackgroundContainer/BackgroundContainer.tsx";

const ArithmeticContainer : React.FC<React.PropsWithChildren>= ({children}) => {
    return (
        <div style={{
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }}>
            {children}
        </div>
    )
}

const markdownHeader = "# Your Turn: Adding Up Effects!"

const mdSupervisorQuestion = `
**Your supervisor asks**: *How many ice creams should we expect to sell tomorrow at 14:00 on a workday when it's 25°C outside?*
`
const mdTemperatureTask = `
**Temperature Effect (25°C):**
`

const mdHourTask = `
**Time Effect (14:00)**
`

const mdWorkingDayTask = `
**Workday Effect:**
`

const mdHint = `
**Hint**: Look at each plot and find the effect for each condition, then add them all together!
`

const formSchema = Yup.object().shape({
    temperatureEffect: Yup.number()
        .required("Input required.")
        .typeError("Please enter a valid number.")
        .min(26, "Wrong answer.")
        .max(26, "Wrong answer."),
    hourEffect: Yup.number()
        .required("Input required.")
        .typeError("Please enter a valid number.")
        .min(17, "Wrong answer.")
        .max(17, "Wrong answer."),
    workingdayEffect: Yup.number()
        .required("Input required.")
        .typeError("Please enter a valid number.")
        .min(21, "Wrong answer.")
        .max(21, "Wrong answer."),
    totalEffect: Yup.number()
        .required("Input required.")
        .typeError("Please enter a valid number.")
        .min(64, "Wrong answer.")
        .max(64, "Wrong answer.")
});

type FormSchema = InferType<typeof formSchema>;

interface IntroTask3Props {
    onNext: (introTask3Answer: object) => void
}

const IntroTask3: React.FC<IntroTask3Props> = ({onNext}) : JSX.Element => {

    const [formData, setFormData] = useState<Partial<FormSchema>>({
        temperatureEffect: undefined,
        hourEffect: undefined,
        workingdayEffect: undefined,
        totalEffect: undefined,
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
                    <Box color={"blue"}>
                        <MarkdownBox markdown={mdSupervisorQuestion}/>
                    </Box>
                </BoxRow>
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
                                placeholder="Enter effect value"
                                onChange={handleFieldChange('hourEffect')}
                            />
                        </Box>
                    </BoxCol>
                    <BoxCol>
                        <Box color={"yellow"}>
                            <MarkdownBox markdown={mdWorkingDayTask}/>
                            <ValidatedInput
                                validate={(value) => validateField('workingdayEffect', value)}
                                placeholder="Enter effect value"
                                onChange={handleFieldChange('workingdayEffect')}
                            />
                        </Box>
                    </BoxCol>
                </BoxRow>
                <BoxRow>
                    <Box color={"blue"}>
                        <MarkdownBox markdown={"**Temperature Effect**"}/>
                    </Box>
                    <ArithmeticContainer>
                        <Plus size={40}/>
                    </ArithmeticContainer>
                    <Box color={"green"}>
                        <MarkdownBox markdown={"**Time Effect**"}/>
                    </Box>
                    <ArithmeticContainer>
                        <Plus size={40}/>
                    </ArithmeticContainer>
                    <Box color={"yellow"}>
                        <MarkdownBox markdown={"**Workday Effect**"}/>
                    </Box>
                    <ArithmeticContainer>
                        <Equal size={40}/>
                    </ArithmeticContainer>
                    <ArithmeticContainer>
                        <ValidatedInput
                            validate={(value) => validateField('totalEffect', value)}
                            placeholder="Enter effect value"
                            onChange={handleFieldChange('totalEffect')}
                        />
                    </ArithmeticContainer>
                </BoxRow>
                <BoxRow>
                    <Box color={"green"}>
                        <MarkdownBox markdown={mdHint}/>
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

export default IntroTask3