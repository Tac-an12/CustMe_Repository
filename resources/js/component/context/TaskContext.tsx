import React, { ReactNode } from "react";
import apiService from "../services/apiService";

interface TaskData {
  title: string;
  description: string;
  id: number;
  completed: 0 | 1;
  created_at: string;
  updated_at: string;
}

interface RoleData {
  roleid: string;
  rolename: string;
  // Add more properties if needed
}

interface TaskContextType {
  taskList: TaskData[];
  roleList: RoleData[];
  updateContextData: () => void;
}

const TaskContext = React.createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [taskList, setTaskList] = React.useState<TaskData[]>([]);
  const [roleList, setRoleList] = React.useState<RoleData[]>([]);

  const fetchRoleList = () => {
    apiService
      .get<{ data: RoleData[] }>("roles")
      .then((response) => {
        setRoleList(response.data.data);
      })
      .catch((error) => {
        console.log("Error fetching roles:", error);
      });
  };

  const updateContextData = () => {
    fetchRoleList();
  };

  React.useEffect(() => {
    fetchRoleList();
  }, []);

  return (
    <TaskContext.Provider value={{ taskList, roleList, updateContextData }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = React.useContext(TaskContext);
  if (!context) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }

  return context;
};
