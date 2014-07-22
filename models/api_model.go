package models

type ApiResult struct {
	ResultCode    int         `json:"resultCode"`
	ResultBody    interface{} `json:"resultBody"`
	ResultMessage string      `json:"resultMessage"`
}

func NewApiResult(code int, body interface{}, message string) *ApiResult {
	result := new(ApiResult)
	result.ResultCode = code
	result.ResultBody = body
	result.ResultMessage = message
	return result
}

func SuccessResult(body interface{}) *ApiResult {
	return NewApiResult(200, body, "ok")
}
