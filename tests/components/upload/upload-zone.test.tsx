import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { UploadZone } from "@/components/upload/upload-zone";

describe("UploadZone", () => {
  it("renders the drop zone with instructions", () => {
    const onFileLoaded = vi.fn();
    render(<UploadZone onFileLoaded={onFileLoaded} />);

    expect(screen.getByText(/drop your grok-chats.json here/i)).toBeInTheDocument();
    expect(screen.getByText(/or click to browse/i)).toBeInTheDocument();
  });

  it("has a hidden file input that accepts .json", () => {
    const onFileLoaded = vi.fn();
    const { container } = render(<UploadZone onFileLoaded={onFileLoaded} />);

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).toBeTruthy();
    expect(input.accept).toBe(".json");
    expect(input.className).toContain("hidden");
  });

  it("shows error for non-json files", () => {
    const onFileLoaded = vi.fn();
    const { container } = render(<UploadZone onFileLoaded={onFileLoaded} />);

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(["content"], "data.txt", { type: "text/plain" });

    fireEvent.change(input, { target: { files: [file] } });

    expect(screen.getByText(/please upload a .json file/i)).toBeInTheDocument();
    expect(onFileLoaded).not.toHaveBeenCalled();
  });

  it("calls onFileLoaded with file content for valid json", async () => {
    const onFileLoaded = vi.fn();
    const { container } = render(<UploadZone onFileLoaded={onFileLoaded} />);

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const jsonContent = JSON.stringify({ conversations: [] });
    const file = new File([jsonContent], "grok-chats.json", {
      type: "application/json",
    });

    fireEvent.change(input, { target: { files: [file] } });

    // Wait for FileReader to complete
    await vi.waitFor(() => {
      expect(onFileLoaded).toHaveBeenCalledWith(jsonContent);
    });
  });

  it("has correct accessibility attributes", () => {
    const onFileLoaded = vi.fn();
    render(<UploadZone onFileLoaded={onFileLoaded} />);

    const dropZone = screen.getByRole("button");
    expect(dropZone).toHaveAttribute("tabindex", "0");
  });
});
