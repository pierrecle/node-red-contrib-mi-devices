export class Color {
    static toValue(red, green, blue, brightness) {
        return (brightness !== undefined ? 256 * 256 * 256 * brightness : 0) + (256 * 256 * red) + (256 * green) + blue;
    }

    static fromValue(rgb) {
        var blue = rgb % 256;
        rgb = Math.max(rgb - blue, 0);

        var green = rgb % (256 * 256);
        rgb = Math.max(rgb - green, 0);
        green /= 256;

        var red = rgb % (256 * 256 * 256);
        rgb = Math.max(rgb - red, 0);
        red /= 256 * 256;

        var brightness = rgb / (256 * 256 * 256);

        return {
            brightness: brightness,
            color: {red: red, green: green, blue: blue}
        };
    }
}