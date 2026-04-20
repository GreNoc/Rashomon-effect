import MarkdownBox from "../../utils/MarkdownBox/MarkdownBox.tsx";
import NextButton from "../../utils/NextButton/NextButton.tsx";
import BackgroundContainer from "../../utils/BackgroundContainer/BackgroundContainer.tsx";

interface TaskReminderProps {
    onNext: () => void;
}

const TaskReminder: React.FC<TaskReminderProps> = ({onNext}) : JSX.Element => {
    const mdReminder = `
# Final Phase: Your CityRide Challenge

Congratulations, Resource Manager! It's time to put your skills to the test.

**Your Mission**:
1. Generate 5 insights about bike-sharing patterns
2. Answer 3 critical management questions

Remember: Your performance determines your bonus - up to **double your base compensation**!
    `
    return (
        <BackgroundContainer>
            <MarkdownBox markdown={mdReminder}/>
            <NextButton onNext={onNext} isValid={true}/>
        </BackgroundContainer>
    )
}

export default TaskReminder;