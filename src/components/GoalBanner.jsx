import "../theme/components.css";

export default function GoalBanner({ task }) {
  return (
    <div className="goal-banner">
      <div className="goal-banner__label">&gt;&gt;&gt; jailbreak challenge</div>
      <div className="goal-banner__goal">{task.task}</div>
    </div>
  );
}
