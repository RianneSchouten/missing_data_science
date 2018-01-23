# Missing Data in Data Science

### The effect of missing values treatment on the outcome of a regression model

#### [Rianne Schouten](https://rianneschouten.github.io)

--- 

When you work with data, it is most likely you have encountered missing data. Especially in an application-oriented field like data science, available datasets are almost always incomplete. Just yesterday, a colleague of mine explored data where each value represented the number of clicks on a button in a web application. Obviously, a missing value indicated the absence of clicks and we quickly agreed on an imputation model for that dataset. What to do in a more complicated situation, though? 

Whether you like it or not, missing data requires choosing a missing values treatment. An often used and easy solution is the deletion of incomplete rows and/or columns. However, is it the most appropriate method? What is its effect on the outcome of the model? And more importantly, would this outcome become different when we apply another missing data method? 

In this blogpost, we will shortly introduce several kinds of missing data problems. We will then present the setup of a simulation study. The goal of the simulation is to explore the effect of missing data methods on the outcome of a data science regression model. To that end, we will apply a missing data method and calculate the evaluation error metrics as one would do in a data science pipeline. We compare the results for a range of missing data methods, mechanisms, percentages and for several datasets. 

---

## Missing data mechanisms

In missing data theory, we classify missing data problems into three categories: MCAR, MAR and MNAR missingness. Consider a dataset with outcome feature Y, predicting features X~1~ and X~2~ and some variable Z that is available but not used in the analysis model. For incomplete feature X~1~, the data is: 

- **Missing Completely At Random (MCAR)** when every cell has a fixed, equal probability of being missing. As a result, both large and small X~1~ values become missing. In Figure 1, the missing values are shown in red. 

- **Missing At Random (MAR)** when the probability of being missing depends on observed values. In Figure 2, records with large values on variable Z have a higher probability of being missing on feature X~1~. In Figure 3, missingness depends on the observed values of another X feature, for instance X~2~. In both situations, the correlation between the incomplete and complete feature determines which values become missing. 

- **Missing Not At Random (MNAR)** when the probability of being missing depends on unobserved or missing data. This situation can occur because suitable covariates for explaining missingness have not been recorded (variable Z is not available) or when the probability of being missing depends on the missing X~1~ values itself. 

When the missingness depends on outcome variable Y, and when outcome variable Y is complete observed, scientific researchers would classify this as MAR missingness. After all, the information in Y can be used in the imputation model. However, in data science models, it is generally not accepted to use the outcome variable. One could argue that in situations where missingness in X~1~ depends on the observed values of Y, and variable Y cannot be used in imputation model, it makes more sense to classify the missingness as MNAR. 

Figure 1 |  Figure 2 |  Figure 3
:---------------------:|:-------------------------:|:-------------------------:
![](figures/MCAR.jpg)  |  ![](figures/M(N)ARZ.jpg) | ![](figures/M(N)ARX.jpg)

---

## Simulation setup

In the simulation, we analyzed eight datasets: four real and four simulated datasets. The import and/or generation of these datasets can be found in the [github repository](https://github.com/RianneSchouten/missing_data_science), as well as all other simulation code. 

The simulation is as follows: 

1. We start by splitting a given dataset into 60% trainingset and 40% testset. 

2. We then generate missing values in the training and testset with our function `delete_data`. We assign missing values to all X features, but the output variable remains complete. In each simulation round, we create a MCAR, MARX, MARZ, MNARX and MNARZ missingness mechanism. 

    In case of MARX, the missingness in feature X~1~ depends on the values of feature X~2~, X~2~ depends on X~3~ and so on. For MNARX, missingness in X~1~ depends on X~1~, X~2~ on the values of X~2~, and so on. For MARZ and MNARZ, we create a variable Z that correlates with the outcome variable Y. In case of MARZ, we use Z in the imputation model. In case of MNARZ, we do not use Z to impute. Note that Z is never part of the analysis model. 
    
    For all MAR and MNAR situations, large values have a higher probability of being missing than small values.

3. We create several missingness percentages. We generate the missingness such that 5%, 10%, 15%, up to 55% of the records have at least 1 missing value. In general, 50% of the cells of all incomplete rows have a missing value.

4. We apply six missing data methods to each combination of missingness mechanism and missingness percentage.

    - **Listwise deletion:** drop incomplete rows from the dataset with Pandas `dropna`.

    - **Mean imputation:** imputation with the column (i.e. feature) mean with sklearns `Imputer` class.

    - **Median imputation:** imputation with the column (i.e. feature) median with sklearns `Imputer` class. 

    - **Random imputation:** imputation with a randomly chosen observed value (per column) with a custom adaptation of the `Imputer` class. 

    - **Regression imputation:** each column (i.e. feature) is regressed on the other features. We predict each incomplete value by using the observed values of the other features. When a predictive value is unobserved, we use mean imputation first. Again, we made a custom adaptation of sklearns `Imputer` class. 

    - **Stochastic regression imputation:** regression imputation as explained above, but with the addition of some noise. To each imputation, we add (or subtract) a random value. We sample the noise from a normal distribution with mean 0 and standard deviation equal to the uncertainty of the regression imputation model. Again, a custom adaptation of `Imputer`. 

5. The outcome variable Y is regressed on the X features with a `LinearRegression()` model from `sklearn.linear_model`. In particular, we apply a missing data method to the training set, fit the regression model on the training set, apply the same missing data method to the testset, and make the predictions with the fitted regression model. We evaluate our model by retrieving the following `sklearn.metrics`: `mean_squared_error`, sqrt(`mean_squared_error`), `mean_absolute_error` and `explained_variance`. We also calculate the MSE difference between the model fitted on the training set and the model applied on the testset. Hence, a negative value indicates overfitting of the model. 

6. Every combination of missingness mechanism, missingness proportion and missing values treatment is repeated 3000 times for the real datasets and 100 times for the simulated datasets (more is not needed due to the large size of these datasets). We report the average and IQR of the evaluation metrics. 

---

## Outcome complete datasets

In order to have a reference for the outcomes, we performed the linear regression model on the original, complete datasets. The evaluation error metrics for real datasets are as follows: 

Dataset | MSE | RMSE  | MAE | EV   | DIF 
:------:|:---:|:-----:|:---:|:----:|:----:
[Concrete slump test](https://archive.ics.uci.edu/ml/machine-learning-databases/concrete/slump/) | 62.468 | 7.842  | 6.483 | 0.146 | -12.232
[Forest Fires](https://archive.ics.uci.edu/ml/machine-learning-databases/forest-fires/.) | 4160.603 | 50.394 | 21.477 | -0.785 | -222.325  
[Red Wine Quality](https://www.kaggle.com/uciml/red-wine-quality-cortez-et-al-2009/data) | 0.437 |0.661 | 0.510 | 0.298 | -0.022  
[School Alcohol Consumption](https://www.kaggle.com/uciml/student-alcohol-consumption/data) | 0.487 | 0.694 | 0.483 | 0.364 | -0.056 

Our simulation datasets have either a poor or rich correlation structure (see figures below). A continuous output variable is sampled by making a linear equation with the features, using a random weights vector, and by adding noise. We generated the output variable with two levels of noise: little and much. 

Poor correlation structure  |  Rich correlation structure
:---------------------:|:-------------------------:
![](figures/poor.png)  |  ![](figures/rich.png)


Correlation | Noise | MSE | RMSE  | MAE | EV   | DIF 
:----------:|:-----:|:---:|:-----:|:---:|:----:|:-----:
Poor | Little |0.010 | 0.101 | 0.081 | 0.999  | -0.000
Poor | Much |24.603 | 4.960 | 3.960 |  0.992 | -0.255 
Rich | Little  |0.010 | 0.099 | 0.080 |  0.999 | -0.000
Rich | Much | 24.867 | 4.97 | 3.961 |  0.999 | -0.239 

---

## Simulation outcome

All outcome values are presented in [this interactive plot](https://rianneschouten.github.io/missing_data_science/). A discussion of some interesting results is given below. 

---

#### Concrete Slump Test

Compared with the outcome of the complete dataset, missing values induce an increase of MSE, RMSE and MAE and a decrease of EV. This result is obvious, because the missing data induces uncertainty in the data. For the same reason, the evaluation error metrics become worse when the percentage of missingness increases. It is interesting to see this effect is largest for the `dropna` method. 

When we inspect the results for a MCAR mechanism, we find that mean and median imputation perform better than regression, stochastic regression and random imputation. The results from mean and median imputation greatly overlap, indicating that the variable distributions in this dataset are quite symmetric. 

It is apparent that using regression imputation instead of mean or median imputation does not improve the model. This is the situation for all missingness mechanisms. Moreover, when the missingness depends on a variable outside the data (Z), it is not of influence whether or not you use Z to esimate the imputation (MARZ versus MNARZ). This outcome is quite unexpected. 

One possible explanation might be that in our simulation, the missingness in the training set is comparable to the missingness in the testset. You could argue that, as a consequence, any mistake you make fitting the imputation model will result in the same mistakes in the testset. The results could be that the accuracy of predictions are not affected. Of course, more research on this has to be done.

--- 

#### Forest Fires

Dataset Fores Fires performs quite badly with a linear regression model. The explained variance even drops below zero and the analysis model is underfitting in almost all situations. Interestingly though, when variable Z is used to make a regression or stochastic regression imputation model (MARZ), the MSE values decrease extremely. However, when we check the difference between trainingset MSE and testset MSE (DIF), we see that these results are the consequence of overfitting.  

--- 

#### Red Wine Quality 

In the Red Wine Quality dataset, we see that the regression imputation method performs equal or better than mean and median imputation. From the outcome of the complete datasets, we also know that the overall analysis model of the Red Wine Quality dataset is better than the Concrete Slump Test and Forest Fires datasets. Therefore, it makes sense that using a regression imputation model is beneficial over the other missing data methods.  

However, we also see that stochastic regression imputation still results in large MSE and RMSE values. Recall that stochastic regression imputation is regression imputation with the addition of some noise. Because we base the amount of noise on the performance of the regression model, and because the amount of noise is apparently that much that the imputations come close to random imputations, there is reason to think that regression imputation is not much better than mean or median imputation. 

Furthermore, when we change the y-axis to TRAIN MSE - TEST MSE (DIF), we see that mean, median and regression imputation show a comparable extent of overfitting. Although these models return the smallest MSE and RMSE values, the MSE difference between training and testset is more optimal for random and stochastic regression imputation. With those missing data methods, the risk of overfitting is less than with the other methods. 

---

#### School Alcohol Consumption

Of all real datasets, the School Alcohol Consumption dataset gives the largest explained variance after fitting a simple, linear regression model. Therefore, the effects we saw with the Red Wine Quality dataset are even clearer for this dataset. 

Furthermore, compare the MSE values between MARZ and MARX. In case of MARZ, MSE values after implementing regression imputation are much smaller than with the other missing data methods. In case of MARX, regression imputation performs comparable with mean and median imputation. Apparently, the Z variable is very useful in making sensible predictions of the missing values. Although this may seem obvious because the missingness also depends on Z, the same amount of information is available in case of MARX. However, with MARX, much more features are involved in the missingness, including variables with a small correlation with the outcome variable. As a result, it may be more difficult to properly fit a regression imputation model. 

--- 

#### Simulated data

It is clear from the output from the complete datasets, that despite of the noise, the datasets can be analyzed very well with a regression model. The perfect characteristics of the simulated datasets make that mean and median imputation exactly overlap. The same applies to regression and stochastic regression imputation. Furthermore, the `dropna` method gives perfect results. The reason for this outcome is that, in particular, the rows with extreme values are removed from the dataset.

Nonetheless, what we understand from these simulations is that the performance of regression imputation is clearly affected by the correlation structure of the data. With strong correlations between the X features, regression and stochastic regression imputation perform better than mean and median imputation. At the same time, regression imputation performs well when there is much noise in the outcome variable. Although these results may seem contradictory, these results could also show that regression imputation is able to add structure to the data.  

--- 

## Discussion

For all results described above, we must note that sometimes the differences between the y-axis values are very small. Even though there could be a performance difference between missing data methods, it is questionable whether these effects are useful for daily practice. After all, spending a week on finetuning the hyperparameters of a model might benefit the outcome value of the model more than choosing the most appropriate missing data method. 

However, the results from these simulations also show that the behaviour of missing data methods may be quite unexpected. For instance, the `dropna` method gives very low MSE values but is also very risky for overfitting. In some situations, regression imputation can be useful, but for other situations it might be an unstable and unreliable method. In my opinion, more investigation is required to understand exactly how missing data methods are related to the outcome of a data science pipeline. 

In general, we have to ask ourselves whether we want to evaluate the performance of missing data methodologies by their effect on MSE, EV or DIF value. Are those evaluation error metrics a useful indication of how appropriate a missing data method is? In our simulations, mean and median imputation turn out to be the most stable imputation methods. They are fast, easy to implement and very important, they are not sensitive for leakage and overfitting. 

In terms of model parameters, however, it is known that mean and median imputation induce great amounts of bias in the regression coefficients. Is bias not important for data science models? Might it be better to evaluate our imputation methods with something like imputation accuracy: the extent to which an imputation method is able to restore the true, original data? 

For now, [the interactive plot](https://rianneschouten.github.io/missing_data_science/) shows the results we have so far. In the future, we might want to change the simulation setup. We might want to change the evaluation measures. Or we might stop thinking about this and spend our time on things like grid search, neural networks and bayesian methods. What is your opinion? 

--- 

## Thanks

Thanks to [Coen Seinen](https://www.linkedin.com/in/coen-seinen-47126a79/) for helping me with the simulation code and thanks to [Koen Verschuren](https://www.linkedin.com/in/koen-verschuren-175b7014/) for helping me with the interactive plot. For questions, remarks or feedback, do not hesitate to [contact me](https://rianneschouten.github.io/#contact). 
 