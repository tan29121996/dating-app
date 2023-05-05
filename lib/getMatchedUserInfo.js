const getMatchedUserInfo = (users, currentUserProfile) => {
  const newUsers = {...users};
  delete newUsers[currentUserProfile];

  const [id, user] = Object.entries(newUsers).flat();

  return { id, ...user }
};

export default getMatchedUserInfo;
