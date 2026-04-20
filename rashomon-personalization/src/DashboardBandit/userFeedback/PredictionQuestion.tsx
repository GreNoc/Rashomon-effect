import React, { useState, useEffect } from "react";
import rawBikeSharingDays from "./assets/bikesharing_day.json";
import rawBikeSharingHours from "./assets/bikesharing_hour.json";

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

interface BikeSharingDay extends Omit<RawBikeSharingDay, 'weekday' | 'season' | 'workingday'>{
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

//@ts-expect-error ignore redundant daily data
const bikesharingDays: Array<BikeSharingDay> = rawBikeSharingDays.map(processBikeSharingDayData);
const bikesharingHours: Array<BikeSharingHour> = (rawBikeSharingHours as Array<RawBikeSharingHour>).map(processBikeSharingHourData)

const BikeEstimateComponent: React.FC = () => {
    // State to store the random day, user's input, and feedback
    const [randomHour, setRandomHour] = useState<BikeSharingHour | null>(null);
    const [estimate, setEstimate] = useState<string>("");
    const [feedback, setFeedback] = useState<string>("");

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * bikesharingHours.length);
        setRandomHour(bikesharingHours[randomIndex]);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEstimate(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (randomHour && estimate) {
            const numericEstimate = parseInt(estimate, 10);
            if (isNaN(numericEstimate)) {
                setFeedback("Please enter a valid number.");
            } else {
                const difference = Math.abs(numericEstimate - randomHour.cnt);
                if (difference <= 100) {
                    setFeedback(`Great! Your estimate is close. The actual count was ${randomHour.cnt}.`);
                } else {
                    setFeedback(`Not quite. Your estimate was off by ${difference}. The actual count was ${randomHour.cnt}.`);
                }
            }
        }
    };

    return (
        <div>
            <h2>How many bikes do you estimate to be rented on the following day?</h2>
            {randomHour && (
                <div>
                    <p><strong>Season:</strong> {randomHour.season}</p>
                    <p><strong>Weekday:</strong> {randomHour.weekday}</p>
                    <p><strong>Working Day:</strong> {randomHour.workingday ? "Yes" : "No"}</p>
                    <p><strong>Time:</strong> {randomHour.hr }</p>
                    <p><strong>Temperature:</strong> {randomHour.temp.toFixed(2)} </p>
                    <p><strong>Wind Speed:</strong> {randomHour.windspeed.toFixed(2)}</p>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div>
                <label htmlFor="estimate">Your Estimate:</label>
                    <input
                        id="estimate"
                        type="text"
                        value={estimate}
                        onChange={handleInputChange}
                        placeholder="Enter your estimate here"
                    />
                    <button type="submit">Submit</button>
                </div>
            </form>

            {/* Feedback section */}
            {feedback && <p>{feedback}</p>}
        </div>
    );
};

export default BikeEstimateComponent;