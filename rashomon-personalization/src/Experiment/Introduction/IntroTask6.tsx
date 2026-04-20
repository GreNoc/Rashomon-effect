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

const markdownHeader = "# Generating Insights"

const mdExampleInsights = `
## Example Insights

1. **Basic Pattern & Quantification**: The temperature effect shows a steady increase in sales across all temperatures, with approximately linear growth between 15°C and 30°C.

*Why it's good: Goes beyond just stating a trend by quantifying the relationship and specifying the range of effect.*

2. **Complex Interactions**: Evening hours show a particularly strong temperature effect, with the impact of temperature 
being 2-3 times stronger after 5 PM compared to morning hours. This interaction suggests temperature's influence isn't 
uniform but varies substantially throughout the day.

*Why it's good: Describes complex interactions between variables, quantifies the varying strength.*
`

const mdTask = `
**Your turn:**
Study the plots and describe two interesting relationships you discover. Consider:
- How do different factors incluence each other?
- Where do effects become stronger or weaker?
- Are the relationships simple or more complex?
`

const formSchema = Yup.object().shape({
    insight1: Yup.string()
        .required("Input required."),
    insight2: Yup.string()
        .required("Input required.")
});

type FormSchema = InferType<typeof formSchema>;

interface IntroTask6Props {
    onNext: (introTask6Answer: object) => void

}

const IntroTask6: React.FC<IntroTask6Props> = ({onNext}) : JSX.Element => {

    const [formData, setFormData] = useState<Partial<FormSchema>>({
        insight1: undefined,
        insight2: undefined,
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
                            <DashboardPlot dashboardData={iceCreamPlotData["Workday"]}/>
                        </div>
                    </BoxCol>
                    <BoxCol>
                        <Box color={"blue"}>
                            <BoxCol>
                                    <MarkdownBox markdown={mdExampleInsights}/>
                            </BoxCol>
                        </Box>
                    </BoxCol>
                </BoxRow>
                <BoxRow>
                    <BoxCol>
                        <Box color={"blue"}>
                            <MarkdownBox markdown={"**What we can observe**: Sharp incrase during morning hours (9-12)"}/>
                        </Box>
                    </BoxCol>
                    <BoxCol>
                        <Box color={"blue"}>
                            <MarkdownBox markdown={"**What we can observe**: More sales on working days compared to weekends"}/>
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
                            <MarkdownBox markdown={mdTask}/>
                            <ValidatedInput
                                validate={(value) => validateField('insight1', value)}
                                placeholder="Enter insight"
                                onChange={handleFieldChange('insight1')}
                                rows={2}
                            />
                            <ValidatedInput
                                validate={(value) => validateField('insight2', value)}
                                placeholder="Enter insight"
                                onChange={handleFieldChange('insight2')}
                                rows={2}
                            />
                        </Box>
                    </BoxCol>
                </BoxRow>
                <BoxRow>
                    <BoxCol>
                        <Box color={"blue"}>
                            <MarkdownBox markdown={"**What we can observe**: Steady increase across all temperatures"}/>
                        </Box>
                    </BoxCol>
                    <BoxCol>
                        <Box color={"blue"}>
                            <MarkdownBox markdown={"**What we can observe**: Strong effects (red) during warm evenings"}/>
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

export default IntroTask6