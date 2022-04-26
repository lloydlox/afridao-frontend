import "./Give.scss";

import { t } from "@lingui/macro";
import { Grid, Typography, Zoom } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Paper, Tab, TabPanel, Tabs } from "@olympusdao/component-library";
import { useState } from "react";
import { useHistory } from "react-router";
import { isSupportedChain } from "src/helpers/GiveHelpers";
import { useV1RedeemableBalance } from "src/hooks/useGiveInfo";
import { useWeb3Context } from "src/hooks/web3Context";
import { ChangeAssetType } from "src/slices/interfaces";
import grantData from "src/views/Give/grants.json";
import projectData from "src/views/Give/projects.json";

import { CallToRedeem } from "./CallToRedeem";
import CausesDashboard from "./CausesDashboard";
import { GiveInfo } from "./GiveInfo";
import { GohmToggle } from "./GohmToggle";
import GrantInfo from "./GrantInfo";
import GrantsDashboard from "./GrantsDashboard";
import ProjectInfo from "./ProjectInfo";
import RedeemYield from "./RedeemYield";
import YieldRecipients from "./YieldRecipients";

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

/**
 * selectedIndex values:
 *
 * 0: project list
 * 1: my donations
 * 2: redeem
 */
type GiveProps = {
  selectedIndex?: number;
  component?: string;
  type?: string;
};

function Give({ selectedIndex, component, type }: GiveProps) {
  const { address, networkId } = useWeb3Context();
  const [zoomed, setZoomed] = useState(false);
  const [view, setView] = useState(selectedIndex || 0);
  const [currComponent, setCurrComponent] = useState(component || "");
  const [currType, setCurrType] = useState(type ? type : "");

  const [giveAssetType, setGiveAssetType] = useState<"sOHM" | "gOHM">("sOHM");

  const changeGiveAssetType: ChangeAssetType = (checked: boolean) => {
    setGiveAssetType(checked ? "gOHM" : "sOHM");
  };

  const changeComponent = (newComponent: string) => {
    if (newComponent === "give") {
      setCurrComponent("");
      buttonChangeView(0);
    } else if (newComponent === "grants") {
      setCurrComponent("");
      buttonChangeView(1);
    } else {
      setCurrType("project");
      setCurrComponent(newComponent);
    }
  };

  const { grants } = grantData;
  const { projects } = projectData;

  const v1RedeemableBalance = useV1RedeemableBalance(address);
  const hasV1Assets = v1RedeemableBalance.data && v1RedeemableBalance.data != "0.0";

  const theme = useTheme();
  const isBreakpointXS = useMediaQuery(theme.breakpoints.down("xs"));
  const history = useHistory();

  const changeView: any = (_event: React.ChangeEvent<unknown>, newView: number) => {
    buttonChangeView(newView);
  };

  /**
   * Handler for changing the selected tab from other files
   *
   * @param newView the index of the newly-selected tab
   */
  const buttonChangeView = (newView: number) => {
    setView(newView);

    if (newView === 0) {
      history.push("/give/");
    } else if (newView === 1) {
      history.push("/give/grants/");
    } else if (newView === 2) {
      history.push("/give/donations/");
    } else {
      history.push("/give/redeem/");
    }
  };

  return (
    <>
      {(() => {
        if (currComponent != "" && currType != "" && currType === "project") {
          return (
            <ProjectInfo
              project={projects.filter(project => project.slug === currComponent)[0]}
              giveAssetType={giveAssetType}
              changeAssetType={changeGiveAssetType}
              changeComponent={changeComponent}
            />
          );
        } else if (currComponent != "" && currType != "" && currType === "grant") {
          return (
            <GrantInfo
              grant={grants.filter(grant => grant.slug === currComponent)[0]}
              giveAssetType={giveAssetType}
              changeAssetType={changeGiveAssetType}
              changeComponent={changeComponent}
            />
          );
        } else {
          return (
            <Grid container direction="column" alignItems="center">
              <Grid item xs />
              <Grid item xs={12} sm={10} md={10} lg={8}>
                <Zoom in={true} onEntered={() => setZoomed(true)}>
                  <Paper headerText={t`Give`} childPaperBackground={true} fullWidth className="no-container-padding">
                    {!isSupportedChain(networkId) ? (
                      <Typography variant="h6">
                        Note: You are currently using an unsupported network. Please switch to Ethereum to experience
                        the full functionality.
                      </Typography>
                    ) : (
                      <></>
                    )}
                    {hasV1Assets && <CallToRedeem />}
                    <Tabs
                      key={String(zoomed)}
                      centered
                      value={view}
                      className={`give-tab-buttons ${isBreakpointXS ? `give-tab-buttons-xs` : ``}`}
                      onChange={changeView}
                      aria-label="stake tabs"
                    >
                      <Tab label={t`Causes`} {...a11yProps(0)} />
                      <Tab label={t`Grants`} {...a11yProps(1)} />
                      <Tab label={t`My Donations`} {...a11yProps(2)} />
                      <Tab label={t`Redeem`} {...a11yProps(3)} />
                    </Tabs>

                    <TabPanel value={view} index={0}>
                      <GohmToggle giveAssetType={giveAssetType} changeAssetType={changeGiveAssetType} />
                      <CausesDashboard
                        giveAssetType={giveAssetType}
                        changeAssetType={changeGiveAssetType}
                        changeComponent={changeComponent}
                      />
                    </TabPanel>
                    <TabPanel value={view} index={1}>
                      <GohmToggle giveAssetType={giveAssetType} changeAssetType={changeGiveAssetType} />
                      <GrantsDashboard
                        giveAssetType={giveAssetType}
                        changeAssetType={changeGiveAssetType}
                        changeComponent={changeComponent}
                      />
                    </TabPanel>
                    <TabPanel value={view} index={2}>
                      {/* We have a button to switch tabs in this child component, so need to pass the handler. */}
                      <YieldRecipients
                        changeView={buttonChangeView}
                        giveAssetType={giveAssetType}
                        changeAssetType={changeGiveAssetType}
                      />
                    </TabPanel>
                    <TabPanel value={view} index={3}>
                      <RedeemYield />
                    </TabPanel>
                  </Paper>
                </Zoom>
                <Zoom in={true}>
                  <GiveInfo />
                </Zoom>
              </Grid>
              <Grid item xs />
            </Grid>
          );
        }
      })()}
    </>
  );
}

export default Give;
