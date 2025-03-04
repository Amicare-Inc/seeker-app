// src/hooks/useUsersList.ts
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAvailableUsers } from "@/redux/userListSlice";
import { RootState, AppDispatch } from "@/redux/store";

const useUsersList = (isPsw: boolean) => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, error } = useSelector((state: RootState) => state.userList);

  useEffect(() => {
    dispatch(fetchAvailableUsers({ isPsw }));
  }, [dispatch, isPsw]);

  return { users, loading, error };
};

export default useUsersList;