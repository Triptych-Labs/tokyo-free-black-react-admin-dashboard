import { ListSubheader, List } from '@mui/material';
import { useLocation, matchPath } from 'react-router-dom';
import SidebarMenuItem from './item';
import menuItems, { MenuItem, MenuItems } from './items';
import { styled } from '@mui/material/styles';
import React, { useState, useEffect, useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { proposals } from 'src/content/pages/Apps/DAO/atoms/proposals';

const MenuWrapper = styled(List)(
  ({ theme }) => `
    margin-bottom: ${theme.spacing(1)};
    padding: 0;

    & > .MuiList-root {
      padding: 0 ${theme.spacing(2)} ${theme.spacing(2)};
    }

    .MuiListSubheader-root {
      text-transform: uppercase;
      font-weight: bold;
      font-size: ${theme.typography.pxToRem(12)};
      color: ${theme.sidebar.menuItemHeadingColor};
      padding: ${theme.spacing(0.8, 2)};
      line-height: 1.4;
    }
`,
);

const SubMenuWrapper = styled(List)(
  ({ theme }) => `
    &.MuiList-root {
      padding: 0;

      .MuiList-root .MuiList-root .MuiListItem-root .MuiButton-root {
        font-weight: normal !important;
      }

      .MuiListItem-root {
        padding: 2px ${theme.spacing(2)};
    
        .MuiButton-root {
          display: flex;
          color: ${theme.sidebar.menuItemColor};
          background-color: ${theme.sidebar.menuItemBg};
          width: 100%;
          justify-content: flex-start;
          font-size: ${theme.typography.pxToRem(13)};
          padding-top: ${theme.spacing(0.8)};
          padding-bottom: ${theme.spacing(0.8)};
          position: relative;

          .MuiBadge-root {
            position: absolute;
            right: ${theme.spacing(4)};

            .MuiBadge-standard {
              background: ${theme.colors.primary.main};
              font-size: ${theme.typography.pxToRem(9)};
              font-weight: bold;
              text-transform: uppercase;
              color: ${theme.palette.primary.contrastText};
            }
          }
    
          .MuiButton-startIcon,
          .MuiButton-endIcon {
            transition: ${theme.transitions.create(['color'])};

            .MuiSvgIcon-root {
              font-size: inherit;
              transition: none;
            }
          }

          .MuiButton-startIcon {
            font-size: ${theme.typography.pxToRem(26)};
            margin-right: ${theme.spacing(1.5)};
            color: ${theme.sidebar.menuItemIconColor};
          }
          
          .MuiButton-endIcon {
            margin-left: auto;
            font-size: ${theme.typography.pxToRem(22)};
          }

          &.Mui-active,
          &:hover {
            background-color: ${theme.sidebar.menuItemBgActive};
            color: ${theme.sidebar.menuItemColorActive};

            .MuiButton-startIcon,
            .MuiButton-endIcon {
                color: ${theme.sidebar.menuItemIconColorActive};
            }
          }
        }

        &.Mui-children {
          flex-direction: column;
          line-height: 1;
        }

        .MuiCollapse-root {
          width: 100%;

          .MuiList-root {
            padding: ${theme.spacing(1, 0)};
          }

          .MuiListItem-root {
            padding: 1px ${theme.spacing(0)};

            .MuiButton-root {
              font-size: ${theme.typography.pxToRem(13)};
              padding: ${theme.spacing(0.5, 2, 0.5, 6.5)};

              &.Mui-active,
              &:hover {
                background-color: ${theme.sidebar.menuItemBg};
              }
            }
          }
        }
      }
    }
`,
);

const renderSidebarMenuItems = ({
  items,
  path,
}: {
  items: MenuItem[];
  path: string;
}): JSX.Element => (
  <SubMenuWrapper>
    {items.reduce((ev, item) => reduceChildRoutes({ ev, item, path }), [])}
  </SubMenuWrapper>
);

const reduceChildRoutes = ({
  ev,
  path,
  item,
}: {
  ev: JSX.Element[];
  path: string;
  item: MenuItem;
}): Array<JSX.Element> => {
  console.log('reducing child routes');
  const key = item.name;

  const exactMatch = item.ballot
    ? !!matchPath(
        {
          path: item.ballot,
          end: true,
        },
        path,
      )
    : false;

  if (item.items) {
    const partialMatch = item.ballot
      ? !!matchPath(
          {
            path: item.ballot,
            end: false,
          },
          path,
        )
      : false;

    ev.push(
      <SidebarMenuItem
        key={key}
        active={partialMatch}
        open={partialMatch}
        name={item.name}
        icon={item.icon}
        ballot={item.ballot}
        badge={item.badge}
      >
        {renderSidebarMenuItems({
          path,
          items: item.items,
        })}
      </SidebarMenuItem>,
    );
  } else {
    ev.push(
      <SidebarMenuItem
        key={key}
        active={exactMatch}
        name={item.name}
        ballot={item.ballot}
        badge={item.badge}
        icon={item.icon}
      />,
    );
  }

  return ev;
};

function SidebarMenu() {
  const location = useLocation();
  const [ballots, setBallots] = useState([]);
  const [proposalsState, setProposals] = useRecoilState(proposals);

  useEffect(() => {
    if (proposalsState.length > 0) {
      setBallots(
        proposalsState.map((prop) => {
          let mItem: MenuItems = {
            items: [
              {
                name: 'Vote Here',
                ballot: prop.proposalAddress,
              },
            ],
            heading: prop.proposalDescription,
          };
          console.log(mItem);
          return mItem;
        }),
      );
    }
  }, [proposalsState]);

  return (
    <>
      {ballots.length > 0 &&
        ballots.map((section) => (
          <MenuWrapper
            key={section.heading}
            subheader={
              <ListSubheader component="div" disableSticky>
                {section.heading}
              </ListSubheader>
            }
          >
            {renderSidebarMenuItems({
              items: section.items,
              path: location.pathname,
            })}
          </MenuWrapper>
        ))}
    </>
  );
}

export default SidebarMenu;
