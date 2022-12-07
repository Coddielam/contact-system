const SingleOrMultiple = ({
  data,
  prefix,
}: {
  data: string[] | number[];
  prefix?: string;
}) => {
  if (data.length > 1) {
    return (
      <p className="whitespace-nowrap overflow-hidden text-ellipsis">
        {prefix} {data[0]} <span>+{data.length - 1}</span>{" "}
      </p>
    );
  }

  return (
    <p>
      {prefix} {data}
    </p>
  );
};

export default SingleOrMultiple;
