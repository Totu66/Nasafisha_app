export function exportToCSV(
    data: Record<string, unknown>[],
    filename: string,
): void {
    if (!data.length) {
        return;
    }

    const headers = Object.keys(data[0]);

    const rows = data.map((item) =>
        headers
            .map((header) => {
                const value = item[header];

                if (value === null || value === undefined) {
                    return "";
                }

                const text = String(value).replace(/"/g, '""');

                return `"${text}"`;
            })
            .join(","),
    );

    const csv = [headers.join(","), ...rows].join("\n");

    const blob = new Blob([csv], {
        type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
}
