const MiniBarChart = ({ bars }) => {
  return (
    <>
      {bars.map((h, i) => (
        <div
          key={i}
          style={{
            width: "6px",
            height: h,
            background: "#3b66f5",
            borderRadius: "4px",
          }}
        />
      ))}
    </>
  );
};