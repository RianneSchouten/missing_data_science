Missing Data in Data Science: simulations
=========================================

.. role:: pyth(code)
  :language: python

This folder contains all simulation code that is used to run the simulations as described in the blogpost_ and as presented in the interactive plot_.

The structure of the folder is as follows:

- **notebooks:** a folder with Jupyter Notebook simulation scripts
    - 1.0-rms-generate_data.ipynb: Jupyter Notebook used to generate simulated datasets
    - 1.1-rms-import_real_data.ipynb: Jupyter Notebook used to import and slighly adapt four real datasets
    - 1.2-rms-evaluation_complete_data.ipynb: Jupyter Notebook used to calculate the evaluation error metrics in the complete datasets
    - 1.3-rms-simulations.ipynb: Jupyter Notebook used to perform the simulations
- **data:** a folder with the real and simulated datasets
    - **external**: downloaded data
    - **processed**: saved data after using 1.0-rms-generate_data.ipynb and 1.1-rms-import_real_data.ipynb
- **results:** a folder with the saved text files that are generated as outcome of the simulation.ipynb script

For questions, remarks, feedback or any other comments, find my contact details here_.

.. _plot: https://rianneschouten.github.io/missing_data_science/

.. _here: https://rianneschouten.github.io/#contact

.. _blogpost: https://rianneschouten.github.io/missing_data_science/assets/blogpost/blogpost.html

