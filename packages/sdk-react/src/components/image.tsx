import * as React from "react";
import { NoiaClientContainer } from "@noia-network/sdk";
import * as mimeTypes from "mime-types";

import { Helpers } from "../utils/helpers";

interface ImageHtmlPropsFix
  extends React.DetailedHTMLProps<
      React.ImgHTMLAttributes<HTMLImageElement>,
      HTMLImageElement
    > {
  ref?: any;
}

export interface ImageProps extends ImageHtmlPropsFix {
  src: string;
  /**
   * Shows loader component when image is not loaded.
   */
  loaderComponent?: JSX.Element;
  mimeType?: string;
  ref?: React.Ref<Image>;
}

export interface ImageState {
  base64?: string;
  mimeType?: string;
}

export class Image extends React.Component<ImageProps, ImageState> {
  constructor(props: ImageProps) {
    super(props);
    this.state = Image.getDerivedStateFromProps(props, {});
  }

  public element: HTMLImageElement | null = null;

  public static getDerivedStateFromProps(
    nextProps: ImageProps,
    prevState: ImageState
  ): ImageState {
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
    props: ImageProps
  ): React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > {
    const { src, mimeType, loaderComponent, ref, ...restProps } = props;
    return restProps;
  }

  public async componentDidMount(): Promise<void> {
    const client = NoiaClientContainer.getClient();
    const stream = await client.openStream({
      src: this.props.src
    });
    const bytes = await stream.getAllBytes();

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
      <img
        ref={component => (this.element = component)}
        src={`data:${this.props.mimeType};base64,${this.state.base64}`}
        {...this.getProps(this.props)}
      />
    );
  }
}
