const CircularProgress = () => {
  return (
    <div
      style={{
        width: 60,
        height: 60,
        borderRadius: "50%",
        background:
          "conic-gradient(#84cc16 70%, #e5e7eb 0%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: "#f4f4f6",
        }}
      />
    </div>
  );
};