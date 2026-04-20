import React, {useState, useCallback} from "react";
import rawBikeSharingDays from "./assets/bikesharing_day.json";
import rawBikeSharingHours from "./assets/bikesharing_hour.json";
import MarkdownBox from "../MarkdownBox/MarkdownBox.tsx";
import ValidatedInput from "../ValidatedInput/ValidatedInput.tsx";
import * as Yup from "yup";
import {InferType, ValidationError} from "yup";
import NextButton from "../NextButton/NextButton.tsx";

const formSchema = Yup.object().shape({
    estimate: Yup.number()
        .required("Input required.")
        .typeError("Please enter a valid number.")
});

type FormSchema = InferType<typeof formSchema>;

interface PredictionQuestionProps {
    onSubmit: (estimate: number, groundTruth: number) => void
}

interface RawBikeSharingDay {
    temp: number; // normalized temperature
    atemp: number; // normalized feeling temperature
    windspeed: number;
    weekday: number; // 0 (Sunday) - 6 (Saturday)
    workingday: number;
    season: number;
    cnt: number;
}

interface RawBikeSharingHour extends RawBikeSharingDay {
    hr: number;
}

type Weekday = "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
type Season = "Spring" | "Summer" | "Fall" | "Winter";

interface BikeSharingDay extends Omit<RawBikeSharingDay, 'weekday' | 'season' | 'workingday'> {
    weekday: Weekday;
    season: Season;
    workingday: boolean;
}

interface BikeSharingHour extends BikeSharingDay {
    hr: number;
}

// Mappings to lookup weekday and season names
const weekdayLookup = {
    0: "Sunday" as const,
    1: "Monday" as const,
    2: "Tuesday" as const,
    3: "Wednesday" as const,
    4: "Thursday" as const,
    5: "Friday" as const,
    6: "Saturday" as const,
} as Record<string, Weekday>;

const seasonLookup = {
    1: "Spring" as const,
    2: "Summer" as const,
    3: "Fall" as const,
    4: "Winter" as const,
} as Record<string, Season>;

function processBikeSharingDayData(rawBikeSharingDay: RawBikeSharingDay): BikeSharingDay {
    return {
        ...rawBikeSharingDay,
        weekday: weekdayLookup[rawBikeSharingDay.weekday.toString()],
        season: seasonLookup[rawBikeSharingDay.season.toString()],
        workingday: rawBikeSharingDay.workingday === 1,
    };
}

function processBikeSharingHourData(rawBikeSharingHour: RawBikeSharingHour): BikeSharingHour {
    return {
        ...rawBikeSharingHour,
        weekday: weekdayLookup[rawBikeSharingHour.weekday.toString()],
        season: seasonLookup[rawBikeSharingHour.season.toString()],
        workingday: rawBikeSharingHour.workingday === 1,
    };
}

function fmtBikeSharingHour(hour: BikeSharingHour) : string {
    const workdayEntry = hour.workingday ? "Yes" : "No"
    const tempEntry = (hour.atemp * (50+16) -16).toFixed(2)
    const windEntry = (hour.windspeed).toFixed(2)
    const mdTable = `
| Season         | Weekday         | Workday         | Time       | Temperature  | Wind Speed   |
| :--------------| :---------------| :-------------- | :--------- | :----------- | :----------- |
| ${hour.season} | ${hour.weekday} | ${workdayEntry} | ${hour.hr} | ${tempEntry} | ${windEntry} |
`
    return mdTable
}

//@ts-expect-error ignore redundant daily data
const bikesharingDays: Array<BikeSharingDay> = rawBikeSharingDays.map(processBikeSharingDayData);
const bikesharingHours: Array<BikeSharingHour> = (rawBikeSharingHours as Array<RawBikeSharingHour>).map(processBikeSharingHourData)

const PredictionQuestion: React.FC<PredictionQuestionProps> = ({onSubmit}) => {

    const [formData, setFormData] = useState<Partial<FormSchema>>({
        estimate: undefined
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

    const shuffledHours = React.useMemo(
        () => [...bikesharingHours].sort(() => Math.random() - 0.5),
        [bikesharingHours]
    );
    const [currentIndex, setCurrentIndex] = useState(0);

    const currentHour = shuffledHours[currentIndex];
    const nextHour = () => setCurrentIndex((prevIndex) => (prevIndex + 1) % shuffledHours.length);


    return (
        <div>
            <h2>How many bikes do you estimate to be rented on the following day?</h2>
            <MarkdownBox markdown={fmtBikeSharingHour(currentHour)}/>

            <div>
                <ValidatedInput
                    placeholder={"Enter your estimate here"}
                    validate={(value) => validateField("estimate", value)}
                    onChange={handleFieldChange("estimate")}
                    indicatedValidInput={false}
                />
                <NextButton
                    onNext={() => {
                        onSubmit(formData.estimate as number, currentHour.cnt)
                        nextHour()
                    }}
                    isValid={isFormValid()}
                    label={"Please enter your estimate."}
                />
            </div>

        </div>
    );
};

export default PredictionQuestion;