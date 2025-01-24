import { Layout } from "antd";
import { useState } from "react";
import { Card, Menu } from "antd";
import PropTypes from "prop-types";
import UserLayout from "../layout/UserLayout";
import { userPath } from "../../routes/routeConfig";
import { useLocation, useNavigate } from "react-router-dom";
import {
  DesktopOutlined,
  PieChartOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  SettingOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;

const DevLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const items = [
    {
      key: "1",
      icon: <SettingOutlined />,
      label: "DevBoard",
      path: userPath.devBoard,
    },
    {
      key: "2",
      icon: <PieChartOutlined />,
      label: "Dashboard",
      path: userPath.dashboard,
    },
    {
      key: "3",
      icon: <DesktopOutlined />,
      label: "Projects",
      path: userPath.projectManage,
    },
    {
      key: "4",
      icon: <VideoCameraOutlined />,
      label: "Courses",
      path: userPath.courseManage,
    },
  ];

  const handleMenuClick = (e) => {
    const selectedItem = items.find((item) => item.key === e.key);
    if (selectedItem) {
      navigate(selectedItem.path);
    }
  };

  return (
    <UserLayout>
      <Card
        title={<h1 className="text-2xl font-semibold">DevBoard</h1>}
        className="w-full mx-auto md:px-5 pt-4 shadow-lg rounded-lg"
      >
        <div className="flex">
          <Sider
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
            theme="dark"
            className="rounded-lg bg-dark-purple"
          >
            <div className="flex justify-center p-4">
              {collapsed ? (
                <MenuUnfoldOutlined
                  onClick={() => setCollapsed(false)}
                  style={{
                    fontSize: "20px",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                />
              ) : (
                <MenuFoldOutlined
                  onClick={() => setCollapsed(true)}
                  style={{
                    fontSize: "20px",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                />
              )}
            </div>
            <Menu
              selectedKeys={[location.pathname]}
              onClick={handleMenuClick}
              mode="inline"
              items={items.map(({ key, icon, label }) => ({
                key,
                icon,
                label,
              }))}
              style={{
                border: "none",
                color: "#fff",
                fontWeight: "500",
                fontSize: "16px",
              }}
            />
          </Sider>
          <div className="p-6 flex-grow">{children}</div>
        </div>
      </Card>
    </UserLayout>
  );
};

DevLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DevLayout;
