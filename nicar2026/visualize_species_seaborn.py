import sqlite3
import textwrap

import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns


DB_PATH = "trees.db"
OUTPUT_PATH = "most_common_tree_species_seaborn.png"
TOP_N = 10


def load_species_counts(db_path: str, top_n: int) -> pd.DataFrame:
    query = """
    select
      qSpecies,
      count(*) as count
    from trees
    where qSpecies is not null
      and trim(qSpecies) != ''
      and qSpecies != 'Tree(s) ::'
    group by qSpecies
    order by count desc
    limit ?
    """
    with sqlite3.connect(db_path) as conn:
        df = pd.read_sql_query(query, conn, params=(top_n,))
    return df


def shorten_species_name(name: str) -> str:
    common_name = name.split("::", 1)[-1].strip() if "::" in name else name.strip()
    return "\n".join(textwrap.wrap(common_name, width=24))


def main() -> None:
    df = load_species_counts(DB_PATH, TOP_N)
    df["label"] = df["qSpecies"].map(shorten_species_name)

    sns.set_theme(style="whitegrid", context="talk")
    fig, ax = plt.subplots(figsize=(13, 8))
    palette = sns.color_palette("crest", n_colors=len(df))

    sns.barplot(
        data=df,
        x="count",
        y="label",
        hue="label",
        palette=palette,
        dodge=False,
        legend=False,
        ax=ax,
    )

    ax.set_title("Most Common Tree Species in San Francisco Street Tree Data", pad=16)
    ax.set_xlabel("Number of Trees")
    ax.set_ylabel("Species")

    max_count = int(df["count"].max())
    ax.set_xlim(0, max_count * 1.12)

    for patch, count in zip(ax.patches, df["count"]):
        ax.text(
            patch.get_width() + max_count * 0.01,
            patch.get_y() + patch.get_height() / 2,
            f"{count:,}",
            va="center",
            fontsize=11,
        )

    sns.despine(left=True, bottom=True)
    fig.tight_layout()
    fig.savefig(OUTPUT_PATH, dpi=200, bbox_inches="tight")


if __name__ == "__main__":
    main()
