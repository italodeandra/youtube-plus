import theme from "../theme"
import { ThemeProvider } from "@material-ui/core/styles"
import CssBaseline from "@material-ui/core/CssBaseline"
import {
  CircularProgress,
  ListSubheader,
  Menu,
  MenuItem,
  NoSsr,
  SpeedDial,
  SpeedDialAction,
  SvgIcon,
  Typography,
} from "@material-ui/core"
import eyeIcon from "@iconify/icons-heroicons-outline/eye"
import eyeOffIcon from "@iconify/icons-heroicons-outline/eye-off"
import checkIcon from "@iconify/icons-heroicons-outline/check"
import xIcon from "@iconify/icons-heroicons-outline/x"
import useBet365Crawler from "../useYouTubeCrawler"
import { QueryClientProvider } from "react-query"
import queryClient from "../queryClient"
import useCurrentProfileId from "../apiHooks/useCurrentProfileId"
import Snackbar from "@italodeandra/pijama/components/Snackbar"
import useListWatchedVideos from "../apiHooks/useListWatchedVideo"
import useAddWatchedVideo from "../apiHooks/useAddWatchedVideo"
import { useMemo, VFC } from "react"
import useRemoveWatchedVideo from "../apiHooks/useRemoveWatchedVideo"
import state from "../state"
import { IWatchedVideoReqBody } from "../models/WatchedVideo"
import Icon from "@iconify/react"
import { useSnapshot } from "valtio"
import { useWindowSize } from "react-use"

const HomeWithProviders = () => {
  const snap = useSnapshot(state)

  const {
    data: currentProfileId,
    isLoading: isLoadingCurrentProfileId,
    error,
  } = useCurrentProfileId()
  const {
    data: watchedVideos,
    isLoading: isLoadingWatchedVideos,
  } = useListWatchedVideos(currentProfileId)
  const {
    mutate: addWatchedVideo,
    isLoading: isAddingWatchedVideo,
  } = useAddWatchedVideo()
  const {
    mutate: removeWatchedVideo,
    isLoading: isRemovingWatchedVideo,
  } = useRemoveWatchedVideo()
  const [currentVideoId] = useBet365Crawler(currentProfileId, watchedVideos)

  const isLoading = isLoadingCurrentProfileId || isLoadingWatchedVideos
  const isAddingOrRemovingWatchedVideo =
    isAddingWatchedVideo || isRemovingWatchedVideo

  const isWatched = useMemo(
    () =>
      !!watchedVideos &&
      !!currentVideoId &&
      watchedVideos?.includes(currentVideoId),
    [watchedVideos, currentVideoId]
  )

  const actions = useMemo(() => {
    const innerActions = []
    if (!isLoading && !!currentProfileId) {
      if (!!currentVideoId) {
        innerActions.push({
          key: 0,
          icon: !isAddingOrRemovingWatchedVideo ? (
            <SvgIcon>
              <Icon icon={isWatched ? xIcon : checkIcon} />
            </SvgIcon>
          ) : (
            <CircularProgress color="inherit" size={24} />
          ),
          tooltipTitle: (
            <Typography noWrap fontSize={16}>
              Mark as {isWatched ? "unwatched" : "watched"}
            </Typography>
          ),
          onClick: () =>
            !isWatched
              ? addWatchedVideo({
                  userId: currentProfileId,
                  videoId: currentVideoId,
                })
              : removeWatchedVideo({
                  userId: currentProfileId,
                  videoId: currentVideoId,
                }),
        })
      }
      innerActions.push({
        key: 1,
        icon: (
          <SvgIcon>
            <Icon icon={snap.isWatchedHidden ? eyeIcon : eyeOffIcon} />
          </SvgIcon>
        ),
        tooltipTitle: (
          <Typography noWrap fontSize={16}>
            {snap.isWatchedHidden ? "Show" : "Hide"} watched
          </Typography>
        ),
        onClick: () => (state.isWatchedHidden = !snap.isWatchedHidden),
      })
    }
    return innerActions
  }, [
    snap.isWatchedHidden,
    isLoading,
    isWatched,
    currentProfileId,
    currentVideoId,
    isAddingOrRemovingWatchedVideo,
  ])

  const { height } = useWindowSize()
  const isFullscreen = height === screen.height

  return (
    <>
      <SpeedDial
        ariaLabel="youtube plus actions"
        sx={{ position: "fixed", bottom: 16, right: 16, pb: 0 }}
        icon={
          !isAddingOrRemovingWatchedVideo && !isLoading && actions[0] ? (
            actions[0].icon
          ) : (
            <CircularProgress color="inherit" size={24} />
          )
        }
        hidden={!!error || isFullscreen}
        FabProps={{
          onClick: (e) => {
            e.currentTarget.blur()
            if (actions[0]) {
              actions[0].onClick()
            }
          },
        }}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.key}
            icon={action.icon}
            tooltipTitle={action.tooltipTitle}
            title=""
            tooltipOpen
            onClick={action.onClick}
          />
        ))}
      </SpeedDial>

      <ContextMenu
        currentProfileId={currentProfileId}
        addWatchedVideo={addWatchedVideo}
        removeWatchedVideo={removeWatchedVideo}
        watchedVideos={watchedVideos}
      />
    </>
  )
}

const ContextMenu: VFC<{
  currentProfileId?: string
  addWatchedVideo: (variables: IWatchedVideoReqBody) => void
  removeWatchedVideo: (variables: IWatchedVideoReqBody) => void
  watchedVideos?: string[]
}> = ({
  currentProfileId,
  addWatchedVideo,
  removeWatchedVideo,
  watchedVideos,
}) => {
  const snap = useSnapshot(state)

  const handleClose = () => {
    state.contextMenu = null
  }

  const isWatched = useMemo(
    () =>
      !!watchedVideos &&
      !!snap.contextMenu?.videoId &&
      watchedVideos?.includes(snap.contextMenu?.videoId),
    [watchedVideos, snap.contextMenu?.videoId]
  )

  return currentProfileId ? (
    <Menu
      open={snap.contextMenu !== null}
      onClose={handleClose}
      anchorReference="anchorPosition"
      anchorPosition={
        snap.contextMenu !== null
          ? { top: snap.contextMenu.mouseY, left: snap.contextMenu.mouseX }
          : { top: 0, left: 0 }
      }
      MenuListProps={{
        subheader: (
          <ListSubheader sx={{ fontSize: 14 }}>
            {snap.contextMenu?.videoId}
          </ListSubheader>
        ),
      }}
    >
      <MenuItem
        sx={{ fontSize: 16 }}
        onClick={() => {
          if (snap.contextMenu?.videoId) {
            if (!isWatched) {
              addWatchedVideo({
                userId: currentProfileId,
                videoId: snap.contextMenu.videoId,
              })
            } else {
              removeWatchedVideo({
                userId: currentProfileId,
                videoId: snap.contextMenu.videoId,
              })
            }
            handleClose()
          }
        }}
      >
        Mark as {isWatched ? "unwatched" : "watched"}
      </MenuItem>
    </Menu>
  ) : null
}

const Home = () => (
  <NoSsr>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Snackbar />
        <HomeWithProviders />
      </ThemeProvider>
    </QueryClientProvider>
  </NoSsr>
)

export default Home
