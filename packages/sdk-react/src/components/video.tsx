import * as React from "react";
import * as mimeTypes from "mime-types";

import { Helpers } from "../utils/helpers";

interface VideoHtmlPropsFix
  extends React.DetailedHTMLProps<
      React.ImgHTMLAttributes<HTMLVideoElement>,
      HTMLVideoElement
    > {
  ref?: any;
}

export interface VideoProps extends VideoHtmlPropsFix {
  src: string;
  additionalSources?: HTMLSourceElement[];
  /**
   * Shows loader component when image is not loaded.
   */
  loaderComponent?: JSX.Element;
  mimeType?: string;
  sourceProps?: React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLSourceElement>,
    HTMLSourceElement
  >;
  ref?: React.Ref<Video>;
}

export interface VideoState {
  base64?: string;
  mimeType?: string;
}

export class Video extends React.Component<VideoProps, VideoState> {
  constructor(props: VideoProps) {
    super(props);
    this.state = Video.getDerivedStateFromProps(props, {});
  }

  public element: HTMLVideoElement | null = null;
  public sourceElement: HTMLSourceElement | null = null;

  public static getDerivedStateFromProps(
    nextProps: VideoProps,
    prevState: VideoState
  ): VideoState {
    let mimeType: string | undefined;
    if (nextProps.mimeType != null) {
      mimeType = nextProps.mimeType;
    } else {
      mimeType = mimeTypes.lookup(nextProps.src) || undefined;
    }

    return {
      ...prevState,
      mimeType: mimeType
    };
  }

  protected getProps(
    props: VideoProps
  ): React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLVideoElement>,
    HTMLVideoElement
  > {
    const {
      src,
      mimeType,
      loaderComponent,
      ref,
      sourceProps,
      ...restProps
    } = props;
    return restProps;
  }

  public async componentDidMount(): Promise<void> {
    const bytes = await NoiaClient.download({
      src: this.props.src
    });

    this.setState({
      base64: Helpers.bytesToBase64(bytes)
    });
  }

  public render(): JSX.Element | null {
    if (this.props.loaderComponent == null && this.state.base64 == null) {
      return null;
    } else if (
      this.props.loaderComponent != null &&
      this.state.base64 == null
    ) {
      return this.props.loaderComponent;
    }

    return (
      <video
        ref={component => (this.element = component)}
        {...this.getProps(this.props)}
      >
        <source
          type={this.state.mimeType}
          ref={component => (this.sourceElement = component)}
          src={`data:${this.state.mimeType};base64,${this.state.base64}`}
          {...this.props.sourceProps}
        />
        {this.props.additionalSources}
      </video>
    );
  }
}
