const Users = (users) => {
  if (!users.data) {
    return <h1>Loading.....</h1>;
  }
  return (
    <>
      {users.data?.map((data, index) => (
        <section className="user" key={index}>
          <img src={data.pictureThumbnail} />
          <div>
            <span>{data.userName}</span>
            <p>{data.email}</p>
          </div>
        </section>
      ))}
    </>
  );
};

export default Users;
